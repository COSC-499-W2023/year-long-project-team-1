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
  // // break down url
  // const pathname = req.nextUrl.pathname;
  // const fullUrl = new URL(req.nextUrl.toString());
  // const url = `${fullUrl.protocol}//${fullUrl.host}`;

  // // if the path is auth code from aws
  // if (pathname.startsWith("/api/auth/authorize")){
  //   middleLog("Process auth code");
  //   NextResponse.next();
  // }

  // // determine if the current path is to be protected, including all API routes except login
  // // determine if the current path is to be protected, including all API routes except login
  // const requiresAuth = protectedPathSlugs.some(
  //   (slug) =>
  //     pathname.startsWith(slug) && !pathname.startsWith("/api/auth/login"),
  // );

  // // if a logged in user should be redirected away, check for those paths
  // const cantBeLoggedIn = loggedInRedirectPathSlugs.some((slug) =>
  //   pathname.startsWith(slug),
  // );
  // if (cantBeLoggedIn) {
  //   // look for session
  //   middleLog("User not allowed for " + pathname);

  //   const user = await getSession();

  //   if (user?.isLoggedIn) {
  //     middleLog("Found user, redirecting.");
  //     return NextResponse.redirect(`${url}/`, { status: 302 });
  //   }
  //   middleLog("Did not find user, continuing.");
  //   return NextResponse.next();
  // }

  // // if the route requires basic auth and does not have an auth header, redirect to login
  // if (requiresAuth) {
  //   // look for session
  //   middleLog("User required for " + pathname);

  //   const user = await getSession();

  //   if (user?.isLoggedIn) {
  //     middleLog("Found user.");

  //     if (loggedInRedirectPathSlugs.some((slug) => pathname.startsWith(slug))) {
  //       middleLog("Authenticated user must redirect from " + pathname);
  //       return NextResponse.redirect(`${url}/`, { status: 302 });
  //     }
  //     middleLog("Allowing user to continue: " + user.email);
  //     return NextResponse.next();
  //   }
  //   middleLog("Did not find user, redirecting.");
  //   return NextResponse.redirect(
  //     `${url}/login?r=${encodeURIComponent(pathname)}`,
  //     { status: 302 },
  //   );
  // }

  // // if the route is a debug page and debug is disabled, 404
  // if (!DEBUG && debugPages.some((slug) => pathname.startsWith(slug))) {
  //   return NextResponse.redirect(`${url}/not-found`, { status: 302 });
  // }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
