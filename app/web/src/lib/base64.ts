/*
 * Created on Mon Oct 30 2023
 * Author: Connor Doman
 */

import { Buffer } from "buffer";

export const utf8ToBase64 = (s: string) => {
    return Buffer.from(s, "binary").toString("base64");
};

export const base64ToUtf8 = (s: string) => {
    return Buffer.from(s, "base64").toString("binary");
};
