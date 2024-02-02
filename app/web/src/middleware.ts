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
"use server";

import { NextRequest, NextResponse } from "next/server";

import { auth } from "./auth";
import { NextAuthOptions, User, getServerSession } from "next-auth";
import { NextAuthMiddlewareOptions, withAuth } from "next-auth/middleware";
import { Role } from "@prisma/client";

// possible protected paths
// const protectedPathSlugs = ["/user", "/staff", "/api"];
const protectedPathSlugs = ["/user", "/staff"];

const userOnlyPathSlugs = ["/user"];
const staffOnlyPathSlugs = ["/staff"];

// redirect if logged in
const loggedInRedirectPathSlugs = ["/login", "/register"];

export default withAuth(
  (req) => {
    function absoluteURL(relative: string) {
      return new URL(relative, req.nextUrl.origin).toString();
    }

    const path = req.nextUrl.pathname;
    const authToken = req.nextauth.token;

    // if no need for auth, continue
    if (!protectedPathSlugs.some((slug) => path.startsWith(slug))) {
      return NextResponse.next();
    }

    // if the path is protected and there is no token, redirect to login
    if (!authToken) {
      return NextResponse.redirect(absoluteURL("/login"));
    }

    const user = authToken.user as User;

    if (!user) {
      return NextResponse.redirect(absoluteURL("/login"));
    }

    // console.log("[middleware.ts] user:", user);

    // is this a staff only path?
    if (
      user.role === Role.CLIENT &&
      staffOnlyPathSlugs.some((slug) => path.startsWith(slug))
    ) {
      return NextResponse.redirect(absoluteURL("/user"));
    }

    // is this a user only path?
    if (
      user.role === Role.PROFESSIONAL &&
      userOnlyPathSlugs.some((slug) => path.startsWith(slug))
    ) {
      return NextResponse.redirect(absoluteURL("/staff"));
    }

    // user is allowed to continue
    return NextResponse.next();
  },
  {
    secret: process.env.PRIVACYPAL_AUTH_SECRET,
  },
);

export const config = {
  matcher:
    "/((?!api/auth|login|logout|signup|_next/static|_next/image|favicon.ico).+)",
};
