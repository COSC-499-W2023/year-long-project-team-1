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

import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { UserRole } from "@lib/userRole";
import { JWT } from "next-auth/jwt";
import { CognitoProfile } from "next-auth/providers/cognito";
import { ChallengeNameType } from "@aws-sdk/client-cognito-identity-provider";

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

    function getUserFromToken(token: JWT) {
      //@ts-ignore
      const profile: CognitoProfile = token.user;
      const roles = profile["cognito:groups"] as string[];
      let role = roles.length > 0 ? roles[0] : undefined;
      return {
        id: profile.sub,
        username: profile["cognito:username"],
        role: role,
        firstName: profile.given_name,
        lastName: profile.family_name,
        email: profile.email,
      };
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

    // redirect to verfication form if user is new client and need to change default password
    if (
      //@ts-ignore
authToken.user.ChallengeName == ChallengeNameType.NEW_PASSWORD_REQUIRED
    ) {
      return NextResponse.redirect(
        absoluteURL(
          //@ts-ignore
          `/verify/${authToken.user.ChallengeParameters.USER_ID_FOR_SRP}`,
        ),
      );
    }

    const user = getUserFromToken(authToken);

    if (!user) {
      return NextResponse.redirect(absoluteURL("/login"));
    }

    // is this a staff only path?
    if (
      user.role === UserRole.CLIENT &&
      staffOnlyPathSlugs.some((slug) => path.startsWith(slug))
    ) {
      return NextResponse.redirect(absoluteURL("/user"));
    }

    // is this a user only path?
    if (
      user.role === UserRole.PROFESSIONAL &&
      userOnlyPathSlugs.some((slug) => path.startsWith(slug))
    ) {
      return NextResponse.redirect(absoluteURL("/staff"));
    }

    // is this a logged in redirect path?
    // (should a user be redirected to their hub after they login to this path?)
    if (loggedInRedirectPathSlugs.some((slug) => path.startsWith(slug))) {
      switch (user.role) {
        case UserRole.CLIENT:
          return NextResponse.redirect(absoluteURL("/user"));
        case UserRole.PROFESSIONAL:
          return NextResponse.redirect(absoluteURL("/staff"));
      }
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
    "/((?!api/auth|login|logout|signup|_next/static|_next/image|favicon.ico|build.json|health).+)",
};
