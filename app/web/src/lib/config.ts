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

import Users from "@conf/user.properties.json";

export const DEBUG: boolean = true;

export const CONFIG_DIRECTORY: string =
  process.env.PRIVACYPAL_CONFIG_DIR ?? "/opt/privacypal/";
export const ENVIRONMENT: string = process.env.NODE_ENV ?? "development";
export const IS_PRODUCTION: boolean = ENVIRONMENT === "production";
export const IS_TESTING: boolean = ENVIRONMENT === "test";

export const COOKIE_NAME: string =
  process.env.PRIVACYPAL_COOKIE_NAME ?? "privacypal";
export const AUTH_SECRET: string = process.env.PRIVACYPAL_AUTH_SECRET || "";

export const extractBasicUserRecords = () => {
  return Users;
};

export const configError = (message: string): Error => {
  throw new Error(`[PrivacyPalConfig]: ${message}`);
};
