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
import { authManager } from "src/auth";

const clientId = process.env.COGNITO_CLIENT || "";
const region = process.env.AWS_REGION || "";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  let redirectURL: string;
  if (authManager == "basic") {
    redirectURL = process.env.NEXTAUTH_URL || "http://localhost:3000";
  } else {
    redirectURL = `https://privacypal.auth.${region}.amazoncognito.com/logout?client_id=${clientId}&response_type=code&logout_uri=${process.env.NEXTAUTH_URL}`;
  }
  return NextResponse.redirect(redirectURL);
}
