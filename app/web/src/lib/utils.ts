/*
 * Copyright [2023] [Privacypal Authors]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { User } from "next-auth";
import { UserRole } from "./userRole";
import prisma from "./db";
import {
  createPresignedUrl,
  getObjectMetaData,
  getObjectTags,
  getOutputBucket,
  getTmpBucket,
} from "./s3";
import { NotFound, Tag } from "@aws-sdk/client-s3";

export interface VideoURL {
  url: string;
  awsRef: string;
  tags: Tag[] | undefined;
  time: Date;
  doneProcessed: boolean;
}

export function isInt(str: string) {
  return /^\d+$/.test(str);
}

export type CSS = React.CSSProperties;
export type Stylesheet = Record<string, CSS>;

export function getUserHubSlug(user: User) {
  switch (user.role) {
    case UserRole.PROFESSIONAL:
      return "/staff";
    case UserRole.CLIENT:
      return "/user";
    default:
      return "/";
  }
}

export async function getPostedVideoURLs(apptId: number, videoId?: string) {
  const videoRef = await prisma.video.findMany({
    where: {
      apptId: apptId,
      // if no videoId is provided, undefined means prisma won't filter using the field
      awsRef: videoId,
    },
    orderBy: {
      time: "desc",
    },
  });

  let urls: VideoURL[] = [];

  for (var ref of videoRef) {
    const awsRef = ref.awsRef;
    try {
      const videoInOuput = await checkVideoExistInBucket(awsRef, getOutputBucket());
      // if the video is not done processed, it won't be in output bucket but it still exists in input bucket
      // there won't be case that video doesn't exist in either input or output bucket, otherwise it's considered stale
      if (!videoInOuput) {
        urls.push({
          awsRef: awsRef,
          url: "",
          tags: [],
          time: ref.time,
          doneProcessed: false,
        });
      } else {
        const presignedURL = await createPresignedUrl({
          bucket: getOutputBucket(),
          key: awsRef,
        });
        const tags = await getObjectTags({
          bucket: getOutputBucket(),
          key: awsRef,
        });
        urls.push({
          awsRef: awsRef,
          url: presignedURL,
          tags: tags.TagSet,
          time: ref.time,
          doneProcessed: true,
        } as VideoURL);
      }
    } catch (e) {
      throw e;
    }
  }

  return urls;
}

async function checkVideoExistInBucket(key: string, bucket: string) {
  try {
    await getObjectMetaData({ bucket, key });
    return true;
  } catch (e) {
    if (e instanceof NotFound) {
      return false;
    } else {
      throw e;
    }
  }
}
