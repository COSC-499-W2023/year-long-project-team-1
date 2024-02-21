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
import { getVideoCount } from "@app/actions";
import db from "@lib/db";
import { JSONResponse, JSONError } from "@lib/response";
import { NextRequest, NextResponse } from "next/server";

// GET /api/video/count?id=1 returns a JSON object with the
// number of videos associated with the specified appointment id
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const apptIdString = searchParams.get("id");
  if (!apptIdString) {
    const response: JSONError = {
      status: 400,
      title: "No appointment id",
      detail: "No appointment id was requested in the search parameters of the API call",
    };
    return NextResponse.json(response, { status: 400 });
  } else {
    // search by apptId
    const id = Number(apptIdString);
    const videos = await getVideoCount(id);

    const response: JSONResponse = { data: { count: videos } };
    return NextResponse.json(response, { status: 200 });
  }
}
