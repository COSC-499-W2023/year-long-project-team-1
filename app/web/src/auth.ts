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
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { NextAuthOptions, getServerSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import CognitoProvider from "next-auth/providers/cognito";
import BasicAuthProvider from "@lib/basic-authenticator";

export const authManager = process.env.PRIVACYPAL_AUTH_MANAGER || "basic";

export const customAuthConfig: NextAuthOptions = {
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login",
  },
  providers: [BasicAuthProvider],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async (payload) => {
      if (payload.user) payload.token.user = payload.user;
      return payload.token;
    },
    session: async ({ session, token }) => {
      return session;
    },
  },
};

const clientId = process.env.AWS_CLIENT || "";
const clientSecret = process.env.AWS_CLIENT_SECRET || "";
const userPoolId = process.env.AWS_POOL_ID || "";
const region = process.env.AWS_REGION || "";

export const cognitoConfig: NextAuthOptions = {
  secret: "secret",
  providers: [
    CognitoProvider({
      clientId: clientId,
      clientSecret: clientSecret,
      issuer: new URL(userPoolId, `https://cognito-idp.${region}.amazonaws.com`)
        .href,
      idToken: true,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // session timeout, user either log in again or new token is requested with refresh token
  },
  callbacks: {
    jwt: async (token) => {
      return Promise.resolve(token);
    },
    session: async ({ session, token }) => {
      // @ts-expect-error
      session.accessToken = token.token.account.access_token;
      session.user = parseUsrFromToken(token);
      return session;
    },
  },
};

function parseUsrFromToken(token: JWT) {
  // @ts-expect-error
  const profile = token.token.profile;
  const role = profile["cognito:groups"][0]; // assuming user belongs to only one user group (client or professional)
  return {
    username: profile["cognito:username"],
    role: role,
    firstName: profile.given_name,
    lastName: profile.family_name,
    phone_number: profile.phone_number,
    email: profile.email,
  };
}

export function getAuthOptions(): NextAuthOptions {
  switch (authManager) {
    case "cognito":
      return cognitoConfig;
    case "basic":
    default:
      return customAuthConfig;
  }
}

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, getAuthOptions());
}
