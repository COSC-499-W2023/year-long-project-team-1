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

import { DEBUG } from "@lib/config";
import { NextRequest, NextResponse } from "next/server";

import middleAuth from "next-auth/middleware";
import { getSession } from "@lib/session";

// possible protected paths
// const protectedPathSlugs = ["/user", "/staff", "/api"];
const protectedPathSlugs = ["/user", "/staff"];

// redirect if logged in
const loggedInRedirectPathSlugs = ["/login", "/register"];

// debug pages
const debugPages = ["/api/auth/hash"];

const middleLog = (...args: any[]) => {
  if (DEBUG) {
    console.log("[middleware.ts]", ...args);
  }
};

const middleError = (...args: any[]) => {
  if (DEBUG) {
    console.error("[middleware.ts]", ...args);
  }
};

export async function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher:
    "/((?![^$]|api/auth|login|logout|signup|_next/static|_next/image|favicon.ico).*)",
};
