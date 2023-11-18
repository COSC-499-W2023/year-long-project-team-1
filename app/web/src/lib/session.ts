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

export async function clearSession(): Promise<boolean> {
    try {
        cookies().delete(ironOptions.cookieName);
        return true;
    } catch (error: any) {
        console.error(error.message);
        return false;
    }
}

export async function getUserFromCookies(cookies: ReadonlyRequestCookies): Promise<PrivacyPalAuthUser | undefined> {
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

    return JSON.parse(unsealedData) as PrivacyPalAuthUser;
}
