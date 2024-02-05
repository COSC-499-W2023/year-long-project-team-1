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
import { NextAuthOptions, Session, User, getServerSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import CognitoProvider, { CognitoProfile } from "next-auth/providers/cognito";
import BasicAuthProvider from "@lib/basic-authenticator";

export const authManager = process.env.PRIVACYPAL_AUTH_MANAGER || "basic";

export const customAuthConfig: NextAuthOptions = {
  secret: process.env.PRIVACYPAL_AUTH_SECRET ?? "badsecret",
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
    session: async ({ session, token }: { session: Session; token: any }) => {
      session.user = token.user;
      return session;
    },
  },
};

const clientId = process.env.COGNITO_CLIENT || "";
const clientSecret = process.env.COGNITO_CLIENT_SECRET || "";
const userPoolId = process.env.COGNITO_POOL_ID || "";
const region = process.env.AWS_REGION || "";

export const cognitoConfig: NextAuthOptions = {
  secret: process.env.PRIVACYPAL_AUTH_SECRET ?? "badsecret",
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

function parseUsrFromToken(token: JWT): User {
  // @ts-expect-error
  const profile: CognitoProfile = token.token.profile;
  const role = profile["cognito:groups"][0]; // assuming user belongs to only one user group (client or professional)
  return {
    id: profile.sub,
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
