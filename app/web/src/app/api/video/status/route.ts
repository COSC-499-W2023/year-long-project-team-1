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
import { NotFound } from "@aws-sdk/client-s3";
import {
  JSONErrorBuilder,
  JSONResponseBuilder,
  VideoStatus,
} from "@lib/response";
import { getObjectMetaData, getOutputBucket } from "@lib/s3";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json(
      JSONResponseBuilder.from(
        400,
        JSONErrorBuilder.from(400, "Filename is not provided"),
      ),
      { status: 400 },
    );
  }

  try {
    await getObjectMetaData({ bucket: getOutputBucket(), key: filename });
  } catch (e: any) {
    // FIXME: Distinguish between actual not-found and not-yet-available
    if (e instanceof NotFound) {
      return NextResponse.json(
        { data: { message: VideoStatus.PROCESSING } },
        { status: 200 },
      );
    } else {
      return Response.json(
        JSONResponseBuilder.from(
          500,
          JSONErrorBuilder.from(
            500,
            "Failure while processing request",
            e.message || e,
          ),
        ),
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    { data: { message: VideoStatus.DONE } },
    { status: 200 },
  );
}
