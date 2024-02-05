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

import { DummyBasicAuthenticator } from "./dummy-authenticator";
import { base64ToUtf8 } from "./base64";
import { JSONResponse } from "./response";

export type PrivacyPalAuthManagerType = "aws_cognito" | "basic" | undefined;
export type PrivacyPalCredentials =
  | Record<"password" | "email", string>
  | undefined;

export interface PrivacyPalAuthUser {
  id: number | string;
  isLoggedIn: boolean;
  email?: string;
  username?: string;
}

export interface PrivacyPalAuthManager {
  authorize: (
    credentials: PrivacyPalCredentials,
  ) => Promise<PrivacyPalAuthUser | null>;
}

export const privacyPalAuthManagerType: PrivacyPalAuthManagerType = process.env
  .PRIVACYPAL_AUTH_MANAGER as PrivacyPalAuthManagerType;

// this may not prove useful since we will have to return specific headers to match the appropriate response of Basic Authentication
export const getAuthManager = (): PrivacyPalAuthManager | undefined => {
  switch (privacyPalAuthManagerType) {
    case "basic":
      // TODO: replace with authenticator that draws from DB
      return new DummyBasicAuthenticator();
    case "aws_cognito":
    default:
      return undefined;
  }
};

export const extractBasicCredentials = (
  authorizationHeader: string,
): PrivacyPalCredentials => {
  const isBasicAuthHeader = authorizationHeader.startsWith("Basic ");
  if (isBasicAuthHeader) {
    const base64Credentials = authorizationHeader.split(" ")[1];
    const credentials = base64ToUtf8(base64Credentials);
    const [email, password] = credentials.split(":");
    return { email, password };
  }
};

export const basicAuthentication = async (
  authorizationHeader: string,
): Promise<PrivacyPalAuthUser | false> => {
  const authManager = getAuthManager();
  if (!authManager) {
    console.error("No auth manager found.");
    return false;
  }

  const authorizedUser = await authManager.authorize(
    extractBasicCredentials(authorizationHeader),
  );
  if (authorizedUser) {
    console.log("authorized user:", { authorizedUser });
    return authorizedUser;
  }
  console.error("User not authorized.");
  return false;
};
