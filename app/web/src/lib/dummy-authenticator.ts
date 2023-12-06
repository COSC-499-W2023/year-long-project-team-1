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

import bcrypt from "bcryptjs";
import {
  PrivacyPalAuthManager,
  PrivacyPalAuthUser,
  PrivacyPalCredentials,
} from "./auth";
import { extractBasicUserRecords } from "./config";

export interface PrivacyPalDummyUser extends PrivacyPalAuthUser {
  id: string;
  email: string;
  hashedPassword: string;
}

export class DummyBasicAuthenticator implements PrivacyPalAuthManager {
  async authorize(
    credentials: PrivacyPalCredentials,
  ): Promise<PrivacyPalAuthUser | null> {
    // extract the user config from the JSON file
    const userConfig = extractBasicUserRecords() as {
      users: PrivacyPalDummyUser[];
    };
    const users: PrivacyPalDummyUser[] = userConfig.users;

    // search the recovered JSON for a user with the same email as the credentials
    const user = users.find(
      (user) => user.email === credentials?.email,
    ) as PrivacyPalDummyUser;

    if (user) {
      // find the plain text password from the credentials
      const plainPassword = credentials?.password;

      if (!plainPassword) {
        console.error("Password not provided");
        return null;
      }

      // retrieve stored password
      const storedPassword = user.hashedPassword;

      if (!storedPassword) {
        console.error("Found user has no password");
        return null;
      }

      // convert stored password back to ASCII from base64
      // compare the plain text password with the hashed password
      const isPasswordValid = await bcrypt.compare(
        plainPassword,
        storedPassword,
      );

      if (isPasswordValid) {
        return { id: user.id, email: user.email } as PrivacyPalAuthUser;
      }
      console.error("Invalid password");
    } else {
      console.error("User not found");
    }
    // if credentials invalid in any way, return null
    return null;
  }
}
