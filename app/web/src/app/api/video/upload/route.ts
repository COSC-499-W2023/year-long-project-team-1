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
import { writeFile } from "fs/promises";
import { timeStampUTC } from "@lib/time";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import { getSession } from "@lib/session";
import { RESPONSE_NOT_AUTHORIZED } from "@lib/response";

const videosDirectory =
  process.env.PRIVACYPAL_INPUT_VIDEO_DIR || "/opt/privacypal/input_videos";

const allowedMimeTypes = [
  "video/mp4", // mp4
  "video/x-msvideo", // avi
  "video/quicktime", // mov
];

const videoServerUrl = process.env.PRIVACYPAL_PROCESSOR_URL || "";

export async function POST(req: Request) {
  // retrieve user id
  const user = await getSession();
  if (!user) {
    return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
  }
  const userID: string = String(user.id);

  // read the multipart/form-data
  const data = await req.formData();
  // get the file
  const file: File = data.get("file") as File;

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

  let filename: string;
  let filePath: string;
  try {
    [filename, filePath] = await saveVideo(file, userID);
  } catch (err: any) {
    return Response.json(
      { message: "Internal Server Error: " + err.message },
      { status: 500 },
    );
  }

  const videoServerRes = await postToVideoServer(filename);

  if (videoServerRes.status == 202) {
    return Response.json(
      { data: { success: true, filePath: filename } },
      { status: 200 },
    );
  } else {
    await fs.unlink(filePath);
    /* Although the error comes from python server, 
           it's inside the system as a whole so return internal sever error instead*/
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

async function postToVideoServer(filename: string): Promise<Response> {
  const url = new URL("/process_video", videoServerUrl);
  url.searchParams.append("filename", filename);
  let videoServerRes = await fetch(url, {
    method: "POST",
  });

  return videoServerRes;
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

async function saveVideo(
  file: File,
  userID: string,
): Promise<[string, string]> {
  // read the file into a buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // determine the path to write the file to
  const cwd = videosDirectory;
  const extension = path.extname(file.name);
  // file name extracted from request
  const fileBaseName = path.basename(file.name, extension);
  // file name combined with userID and timestamp
  const filename = `${userID}-${fileBaseName}-${timeStampUTC()}${extension}`;
  const filePath = path.join(cwd, filename);

  try {
    // write file to disk
    // file will be overwritten if it exists
    await writeFile(filePath, buffer);
    console.log(`file uploaded to: ${filePath}`);
    return [filename, filePath];
  } catch (err: any) {
    console.error(err);
    throw err;
  }
}

async function updateDatabase(appointmentId: number, resourceURI: string) {}
