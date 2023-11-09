/*
 * Created on Thu Nov 09 2023
 * Author: Connor Doman
 */

import { unsealData, sealData } from "iron-session/edge";
import { cookies } from "next/headers";
import { AUTH_SECRET, COOKIE_NAME, DEBUG, IS_PRODUCTION } from "./config";
import { PrivacyPalAuthUser } from "./auth";

export async function getSession(): Promise<PrivacyPalAuthUser | null> {
    const encryptedSession = cookies().get(COOKIE_NAME)?.value;

    const session = encryptedSession
        ? ((await unsealData(encryptedSession, {
              password: AUTH_SECRET,
          })) as string)
        : null;

    return session ? (JSON.parse(session) as PrivacyPalAuthUser) : null;
}

export async function setSession(user: PrivacyPalAuthUser): Promise<void> {
    const encryptedSession = await sealData(JSON.stringify(user), {
        password: AUTH_SECRET,
    });

    cookies().set(COOKIE_NAME, encryptedSession, {
        sameSite: "strict",
        httpOnly: true,
        secure: IS_PRODUCTION && !DEBUG,
    });
}
