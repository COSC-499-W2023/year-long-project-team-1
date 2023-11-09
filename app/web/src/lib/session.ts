/*
 * Created on Thu Nov 09 2023
 * Author: Connor Doman
 */

import { unsealData, sealData } from "iron-session/edge";
import { cookies } from "next/headers";
import { PrivacyPalAuthUser } from "./auth";
import { ironOptions } from "./iron-config";

export async function getSession(): Promise<PrivacyPalAuthUser | null> {
    const encryptedSession = cookies().get(ironOptions.cookieName)?.value;

    const session = encryptedSession
        ? ((await unsealData(encryptedSession, {
              password: ironOptions.password,
          })) as string)
        : null;

    return session ? (JSON.parse(session) as PrivacyPalAuthUser) : null;
}

export async function setSession(user: PrivacyPalAuthUser): Promise<void> {
    const encryptedSession = await sealData(JSON.stringify(user), {
        password: ironOptions.password,
    });

    cookies().set(ironOptions.cookieName, encryptedSession, ironOptions.cookieOptions);
}

export async function clearSession(): Promise<void> {
    cookies().set(ironOptions.cookieName, "", ironOptions.cookieOptions);
}
