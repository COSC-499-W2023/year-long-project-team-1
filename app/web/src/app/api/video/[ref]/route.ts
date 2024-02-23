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
import { getLoggedInUser, deleteVideo } from "@app/actions";
import {
  JSONResponseBuilder,
  RESPONSE_INTERNAL_SERVER_ERROR,
  RESPONSE_NOT_AUTHORIZED,
  RESPONSE_NOT_FOUND,
} from "@lib/response";
import { deleteArtifact, getOutputBucket } from "@lib/s3";
import { checkIfVideoExists } from "@lib/db.support";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { ref: string } },
) {
  // appointment id from the url query
  const searchParams = req.nextUrl.searchParams;
  const appointmentIdParam = searchParams.get("appt");

  // convert appointment id to a number
  const apptId: number = appointmentIdParam ? parseInt(appointmentIdParam) : -1;

  // return bad request if the appointment id is not a number
  if (isNaN(apptId) || apptId < 0) {
    return Response.json(
      JSONResponseBuilder.serverError("Invalid appointment id", 400),
      { status: 400 },
    );
  }

  // video id from the url params
  const videoRef = params.ref;

  // verify the user is in the appointment
  const user = await getLoggedInUser();

  // user id
  const username = user?.username;

  // no user: not authorized
  if (!user || !username) {
    return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
  }

  // check if the video exists in the user's appointment
  const videoExists = await checkIfVideoExists(apptId, videoRef, username);

  // return not found if the video does not exist
  if (!videoExists) {
    return Response.json(RESPONSE_NOT_FOUND, { status: 404 });
  }

  // delete the video from s3
  try {
    deleteArtifact(videoRef, getOutputBucket());
  } catch (err: any) {
    if (err.name === "S3ServiceException" && err.response !== 404) {
      return Response.json(RESPONSE_INTERNAL_SERVER_ERROR, { status: 500 });
    }
  }

  // delete the video from the database
  try {
    await deleteVideo(videoRef);
  } catch (err: any) {
    return Response.json(
      JSONResponseBuilder.serverError(
        `Failed to delete video with ref '${videoRef}'`,
      ),
      { status: 500 },
    );
  }

  // return success
  return Response.json(
    JSONResponseBuilder.ok(`Successfully deleted '${videoRef}'`),
    { status: 200 },
  );
}
