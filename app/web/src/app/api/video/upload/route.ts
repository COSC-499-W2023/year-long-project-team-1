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
import path from "path";
import { timeStampUTC } from "@lib/time";
import { NextResponse } from "next/server";
import { JSONResponse, RESPONSE_NOT_AUTHORIZED } from "@lib/response";
import { getTmpBucket, putArtifactFromFileRef } from "@lib/s3";
import db from "@lib/db";
import { getLoggedInUser } from "@app/actions";

const allowedMimeTypes = [
  "video/mp4", // mp4
  "video/quicktime", // mov
  "video/webm", // webm, need this for recorded-in-browser videos
];

export async function POST(req: Request) {
  // retrieve user id
  const user = await getLoggedInUser();
  if (!user) {
    return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
  }

  // read the multipart/form-data
  const data = await req.formData();
  // get the file
  const file: File = data.get("file") as File;
  const blurFaces: string = data.get("blurFaces") as string;
  const regions: string = data.get("regions") as string;
  const apptIdFromReq: string = data.get("apptId") as string;

  if (!apptIdFromReq) {
    const error: JSONResponse = {
      errors: [
        {
          status: 400,
          title: "Missing apptId.",
        },
      ],
    };
    return Response.json(error, { status: 400 });
  }

  let apptId: number;
  try {
    apptId = parseInt(apptIdFromReq);
  } catch {
    const error: JSONResponse = {
      errors: [
        {
          status: 400,
          title: "apptId must be of type number.",
        },
      ],
    };
    return Response.json(error, { status: 400 });
  }

  // check if user has appointment of apptId
  const appointment = await db.appointment.count({
    where: {
      id: apptId,
      clientUsrName: user.username,
    },
  });

  if (appointment == 0) {
    return Response.json(
      { message: "Appointment not found." },
      { status: 404 },
    );
  }

  // if there was no file parameter, return 400 (bad request)
  if (!file) {
    return Response.json(
      { message: "Video file is not found." },
      { status: 400 },
    );
  } else {
    console.log(`Next.js received file: ${file.name}`);
  }

  if (!fileIsValid(file)) {
    return NextResponse.json(
      { message: "Unsupported Media Type" },
      { status: 415 },
    );
  }

  try {
    // determine the path to write the file to
    const extension = path.extname(file.name);
    // file name extracted from request
    const fileBaseName = path.basename(file.name, extension);
    // file name combined with userID and timestamp
    const uploadFilename = `${user.username}-${fileBaseName}-${timeStampUTC()}${extension}`;  // will have .webm at the end if this is a recorded video
    const filename = `${path.basename(uploadFilename, extension)}.mp4`; // hardcode this extension to .mp4 since we don't want to query s3 for a .webm in our output bucket
    // upload video to s3
    await putArtifactFromFileRef({
      bucket: getTmpBucket(),
      key: uploadFilename,
      file: file,
      metadata: {
        // if blurFaces wasn't set in the formdata, default to true
        blurfaces: blurFaces ?? "true",
        // if regions wasn't set in the formdata, default to an empty list
        regions: regions ?? "[]",
      },
    });
    // add video reference to pg
    await db.video.create({
      data: {
        apptId: Number(apptId),
        awsRef: filename,
        time: new Date(),
      },
    });

    return Response.json(
      { data: { success: true, filePath: filename } },
      { status: 200 },
    );
  } catch (err: any) {
    return Response.json(
      { message: "Internal Server Error: " + err.message },
      { status: 500 },
    );
  }
}

function fileIsValid(file: File): boolean {
  // extract the MIME type
  const fileMimeType = file.type;

  // if the MIME type is not allowed, return 415 (unsupported media type)
  // allowed MIME types are only common videos
  if (!allowedMimeTypes.includes(fileMimeType)) {
    console.log(`MIME type not allowed: ${fileMimeType}`);
    return false;
  }
  return true;
}
