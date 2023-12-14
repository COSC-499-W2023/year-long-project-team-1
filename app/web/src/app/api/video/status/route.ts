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
import { NextRequest, NextResponse } from "next/server";

const videoServerUrl = process.env.PRIVACYPAL_PROCESSOR_URL || "localhost:3000";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json(
      { message: "Filename is not provided." },
      { status: 400 },
    );
  }

  const url = new URL("/process_status", videoServerUrl);
  url.searchParams.append("filename", filename);
  const videoServerRes = await fetch(url);
  const text = await videoServerRes.text();
  return NextResponse.json(
    { message: text },
    { status: videoServerRes.status },
  );
}
