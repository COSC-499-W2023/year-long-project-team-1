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
  AdminInitiateAuthCommand,
  AuthFlowType,
  ChallengeNameType,
} from "@aws-sdk/client-cognito-identity-provider";
import { client as cognitoClient, getClientSecretHash } from "@lib/cognito";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { NextAuthOptions, User, getServerSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { CognitoProfile } from "next-auth/providers/cognito";
import CredentialsProvider from "next-auth/providers/credentials";
import { CognitoJwtVerifier } from "aws-jwt-verify";

export const authManager = process.env.PRIVACYPAL_AUTH_MANAGER || "cognito";

const clientId = process.env.COGNITO_CLIENT || "";
const userPoolId = process.env.COGNITO_POOL_ID || "";

// JWT decoder
const verifier = CognitoJwtVerifier.create({
  userPoolId: userPoolId,
  tokenUse: "id",
  clientId: clientId,
});

const credentialsProvider = CredentialsProvider({
  name: "Custom Cognito",
  id: "customCognito",
  credentials: {
    username: { label: "Username", type: "text" },
    password: { label: "Password", type: "text" },
  },
  authorize: async (credentials: Record<"username"|"password", string> | undefined) => {
    if(!credentials){
      return null;
    }
    const secretHash = getClientSecretHash(credentials.username);
    const params = {
      AuthFlow: AuthFlowType.ADMIN_USER_PASSWORD_AUTH,
      ClientId: clientId,
      UserPoolId: userPoolId,
      AuthParameters: {
        USERNAME: credentials.username,
        PASSWORD: credentials.password,
        SECRET_HASH: secretHash,
      },
    };
    const adminInitiateAuthCommand = new AdminInitiateAuthCommand(params);
    try {
      const response = await cognitoClient.send(adminInitiateAuthCommand);
      // get user info
      if (response.AuthenticationResult?.IdToken) {
        const payload = await verifier.verify(
          response.AuthenticationResult?.IdToken, // the JWT as string
        );
        return {
          ...payload,
          access_token: response.AuthenticationResult.AccessToken,
        } as any;
      } else {
        console.log("id_token is not found.");
        return response as any;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});

export const cognitoConfig: NextAuthOptions = {
  secret: process.env.PRIVACYPAL_AUTH_SECRET ?? "badsecret",
  pages: {
    signIn: "/login",
  },
  providers: [credentialsProvider],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // session timeout, user either log in again or new token is requested with refresh token
  },
  callbacks: {
    jwt: async ({token, user}) => {
      // if jwt is already parsed, skip
      if(!user){
        return Promise.resolve(token);
      }
      // parse jwt
      // @ts-expect-error
      if(user.ChallengeName && user.ChallengeName == ChallengeNameType.NEW_PASSWORD_REQUIRED){
        token.isNewUser = true;
        token.changePassChallenge = {
          name: ChallengeNameType.NEW_PASSWORD_REQUIRED,
          // @ts-expect-error
          session: user.Session,
          // @ts-expect-error
          userIdForSRP: user.ChallengeParameters.USER_ID_FOR_SRP
        }
      }else{
        token.isNewUser = false;
        token.user = user;
      }
      return Promise.resolve(token);
    },
    session: async ({ session, token }) => {
      if(token.isNewUser){
        return session;
      }
      session.accessToken = token.user.access_token;
      session.user = parseUsrFromToken(token);
      return session;
    },
  },
};

function parseUsrFromToken(token: JWT): User {
  const profile = token.user as CognitoProfile;
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

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, cognitoConfig);
}
