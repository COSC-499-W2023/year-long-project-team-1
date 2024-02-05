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
import { getSession } from "@lib/session";
import { RESPONSE_NOT_AUTHORIZED } from "@lib/response";
import { getTmpBucket, putArtifactFromFileRef } from "@lib/s3";

const allowedMimeTypes = [
  "video/mp4", // mp4
  "video/quicktime", // mov
];

export async function POST(req: Request) {
  // retrieve user id
  //   const user = await getSession();
  //   if (!user) {
  //     return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
  //   }
  //   const userID: string = String(user.id);
  const userID: string = "1"; // commented out above for testing

  // read the multipart/form-data
  const data = await req.formData();
  // get the file
  const file: File = data.get("file") as File;
  const regions: string = data.get("regions") as string; // expects "x1,y1,w1,h1,x2,y2,w2,h2,etc". will be null if field "regions" isn't set

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
    const filename = `${userID}-${fileBaseName}-${timeStampUTC()}${extension}`;
    await putArtifactFromFileRef({
      bucket: getTmpBucket(),
      key: filename,
      file: file,
      metadata: { regions: regions === null ? "null" : regions }, // if regions wasn't set in the formdata retrieved earlier, set metadata[regions] = "null"
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
