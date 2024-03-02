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
import { createPresignedUrl, getObjectTags, getOutputBucket } from "./s3";
import { Tag } from "@aws-sdk/client-s3";

export interface VideoURL {
  url: string;
  awsRef: string;
  tags: Tag[] | undefined;
  time: Date;
}

export function isInt(str: string) {
  return /^\d+$/.test(str);
}

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
    } as VideoURL);
  }

  return urls;
}
