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
import { StringAttributeConstraintsType } from "@aws-sdk/client-cognito-identity-provider";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    isNewUser: boolean,
    changePassChallenge?: {
      name: string,
      session: string,
      userIdForSRP: string,
    },
    user?: CognitoProfile
  }
}
declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: User;
  }
  interface User {
    id: string | number;
    username: string;
    role?: Role;
    firstName: string;
    lastName: string;
    email: string;
  }
}
