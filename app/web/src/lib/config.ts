/*
 * Created on Sun Oct 29 2023
 * Author: Connor Doman
 */

import Users from "@conf/user.properties.json";

export const DEBUG: boolean = true;

export const CONFIG_DIRECTORY: string = process.env.PRIVACYPAL_CONFIG_DIR ?? "/opt/privacypal/";
export const ENVIRONMENT: string = process.env.NODE_ENV ?? "development";
export const IS_PRODUCTION: boolean = ENVIRONMENT === "production";
export const IS_TESTING: boolean = ENVIRONMENT === "test";

export const COOKIE_NAME: string = process.env.PRIVACYPAL_COOKIE_NAME ?? "privacypal";
export const AUTH_SECRET: string = process.env.PRIVACYPAL_AUTH_SECRET || "";

export const extractBasicUserRecords = () => {
    return Users;
};

export const configError = (message: string): Error => {
    throw new Error(`[PrivacyPalConfig]: ${message}`);
};
