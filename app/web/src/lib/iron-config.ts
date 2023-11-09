/*
 * Created on Thu Nov 09 2023
 * Author: Connor Doman
 */

import type { IronSessionOptions } from "iron-session";
import { AUTH_SECRET, COOKIE_NAME, DEBUG, IS_PRODUCTION } from "./config";
import { PrivacyPalAuthUser } from "./auth";

export const ironOptions: IronSessionOptions = {
    cookieName: COOKIE_NAME,
    password: AUTH_SECRET,
    cookieOptions: {
        sameSite: "strict",
        httpOnly: true,
        secure: IS_PRODUCTION && !DEBUG,
    },
};

declare module "iron-session" {
    interface IronSessionData {
        user?: PrivacyPalAuthUser;
    }
}
