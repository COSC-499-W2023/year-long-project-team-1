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

import { getLoggedInUser } from "@app/actions";
import { JSONResponse, RESPONSE_NOT_AUTHORIZED } from "@lib/response";
import { NextRequest, NextResponse } from "next/server";
import { createPresignedUrl, getOutputBucket } from "@lib/s3";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const fileKey = searchParams.get("file");

  if (!fileKey) {
    const error: JSONResponse = {
      errors: [
        {
          status: 400,
          title: "Missing file parameter.",
        },
      ],
    };
    return Response.json(error, { status: 400 });
  }

  const user = await getLoggedInUser();
  if (!user) {
    return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
  }

  const url = await createPresignedUrl({
    bucket: getOutputBucket(),
    key: fileKey,
  });
  return NextResponse.json(
    {
      data: url,
    },
    { status: 200 },
  );
}
