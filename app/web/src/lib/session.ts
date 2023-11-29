/*
 * Created on Thu Nov 09 2023
 * Author: Connor Doman
 */
import { unsealData, sealData } from "iron-session/edge";
import { cookies } from "next/headers";
import { PrivacyPalAuthUser } from "./auth";
import { ironOptions } from "./iron-config";
import { type ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function getSession(): Promise<PrivacyPalAuthUser | undefined> {
    return getUserFromCookies(cookies());
}

export async function setSession(user: PrivacyPalAuthUser): Promise<void> {
    const encryptedSession = await sealData(JSON.stringify(user), {
        password: ironOptions.password,
    });

    cookies().set(ironOptions.cookieName, encryptedSession, ironOptions.cookieOptions);
}

export async function clearSession(): Promise<void> {
    cookies().delete(ironOptions.cookieName);
}

export async function getUserFromCookies(cookies: ReadonlyRequestCookies): Promise<PrivacyPalAuthUser | undefined> {
    const hasCookie = cookies.has(ironOptions.cookieName);

    if (!hasCookie) {
        return undefined;
    }

    const encryptedSession = cookies.get(ironOptions.cookieName)?.value ?? "";

    const userData = (await unsealData(encryptedSession, {
        password: ironOptions.password,
    })) as string;

    return JSON.parse(userData) as PrivacyPalAuthUser;
}
