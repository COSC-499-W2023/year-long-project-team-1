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

import { unsealData, sealData } from "iron-session/edge";
import { cookies } from "next/headers";
import { PrivacyPalAuthUser } from "./auth";
import { ironOptions } from "./iron-config";
import { type ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { IS_TESTING } from "./config";

export async function getSession(): Promise<PrivacyPalAuthUser | undefined> {
  return getUserFromCookies(cookies());
}

export async function setSession(user: PrivacyPalAuthUser): Promise<void> {
  const encryptedSession = await sealData(JSON.stringify(user), {
    password: ironOptions.password,
  });

  cookies().set(
    ironOptions.cookieName,
    encryptedSession,
    ironOptions.cookieOptions,
  );
}

export async function clearSession(): Promise<boolean> {
  try {
    cookies().delete(ironOptions.cookieName);
    return true;
  } catch (error: any) {
    console.error(error.message);
    return false;
  }
}

export async function getUserFromCookies(
  cookies: ReadonlyRequestCookies,
): Promise<PrivacyPalAuthUser | undefined> {
  const hasCookie = cookies.has(ironOptions.cookieName);

  if (!hasCookie) {
    return undefined;
  }

  const encryptedSession = cookies.get(ironOptions.cookieName);

  if (!encryptedSession || encryptedSession.value === undefined) {
    return undefined;
  }

  const sessionValue = encryptedSession.value;

  const unsealedData = (await unsealData(sessionValue, {
    password: ironOptions.password,
  })) as unknown as string;

  // this solves an issue with a race condition where the cookie is found but the session has already been unset.
  // otherwise "[object Object] is not a valid JSON string" is thrown because unsealedData === {}
  try {
    return JSON.parse(unsealedData) as PrivacyPalAuthUser;
  } catch (error: any) {
    return undefined;
  }
}
