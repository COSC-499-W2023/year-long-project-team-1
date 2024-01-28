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
import { type NextRequest } from "next/server";
import db from "@lib/db";
import { getLoggedInUser } from "@app/actions";
import {
  JSONResponseBuilder,
  RESPONSE_NOT_AUTHORIZED,
  RESPONSE_NOT_FOUND,
} from "@lib/response";
import { deleteResource } from "@lib/s3";
import { deleteVideo } from "@lib/db.support";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { ref: string } },
) {
  // appointment id from the url query
  const searchParams = req.nextUrl.searchParams;
  const apptId = searchParams.get("appt");

  // video id from the url params
  const videoRef = params.ref;

  // verify the user is in the appointment
  const user = await getLoggedInUser();

  // user id
  const userId = user?.id;

  // no user: not authorized
  if (!user || !userId) {
    return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
  }

  // check if the video exists in the user's appointment
  const videoCount = await db.video.count({
    where: {
      AND: [
        { apptId: parseInt(apptId ?? "-1") },
        { awsRef: videoRef },
        {
          appt: {
            OR: [{ proId: userId }, { clientId: userId }],
          },
        },
      ],
    },
  });

  // no video found for this user's appointment
  if (videoCount !== 1) {
    return Response.json(RESPONSE_NOT_FOUND, { status: 404 });
  }

  // delete the video from s3
  const deleteSuccess = await deleteResource(videoRef, "privacypal-output");

  // delete the video from the database
  const deleteVideoFromDB = await deleteVideo(videoRef);

  // failed to delete the video somewhere
  if (!deleteSuccess || !deleteVideoFromDB)
    return Response.json(
      JSONResponseBuilder.serverError(
        `Failed to delete video with ref '${videoRef}'`,
      ),
      { status: 500 },
    );

  // return success
  return Response.json(
    JSONResponseBuilder.ok(`Successfully deleted '${videoRef}'`),
    { status: 200 },
  );
}
