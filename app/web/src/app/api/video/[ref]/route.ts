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
import { getLoggedInUser, deleteVideo, checkIfVideoExists } from "@app/actions";
import {
  JSONResponseBuilder,
  RESPONSE_INTERNAL_SERVER_ERROR,
  RESPONSE_NOT_AUTHORIZED,
  RESPONSE_NOT_FOUND,
} from "@lib/response";
import { deleteArtifact, getOutputBucket, getTmpBucket } from "@lib/s3";
import { S3ServiceException } from "@aws-sdk/client-s3";

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

  // no user: not authorized
  if (!user) {
    return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
  }

  // check if the video exists in the user's appointment
  const videoExists = await checkIfVideoExists(apptId, videoRef);

  // return not found if the video does not exist
  if (!videoExists) {
    return Response.json(RESPONSE_NOT_FOUND, { status: 404 });
  }

  // delete the video from the database
  try {
    await deleteVideo(videoRef, apptId);
  } catch (err: any) {
    return Response.json(
      JSONResponseBuilder.serverError(
        `Failed to delete video with ref '${videoRef}'`,
      ),
      { status: 500 },
    );
  }

  // delete the video from s3 buckets
  try {
    deleteArtifact(videoRef, getOutputBucket());
    deleteArtifact(videoRef, getTmpBucket());
  } catch (err: any) {
    if (
      err instanceof S3ServiceException &&
      err.$response?.statusCode !== 404
    ) {
      return Response.json(RESPONSE_INTERNAL_SERVER_ERROR, { status: 500 });
    }
  }

  // return success
  return Response.json(
    JSONResponseBuilder.ok(`Successfully deleted '${videoRef}'`),
    { status: 200 },
  );
}
