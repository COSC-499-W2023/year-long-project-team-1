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
import db from "@lib/db";
import { JSONResponse } from "@lib/response";
import { NextRequest, NextResponse } from "next/server";

// GET /api/video/count?id=1 returns a JSON object with the
// number of videos associated with the specified appointment id
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const apptIdString = searchParams.get("id");
  if (apptIdString === null) {
    const response: JSONResponse = {
      errors: [
        {
          status: 404,
          title: "Error: no appointment id requested.",
        },
      ],
    };
    return NextResponse.json(response, { status: 404 });
  } else {
    // search by apptId
    const id = Number(apptIdString);
    const videos = await db.video.findMany({
        where: {
            apptId: id,
        },
    });

    const response: JSONResponse = { data: { count: videos.length } };
    return NextResponse.json(response, { status: 200 });
  }
}
