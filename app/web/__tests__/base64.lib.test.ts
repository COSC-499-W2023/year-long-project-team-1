/*
 * Created on Mon Oct 30 2023
 * Author: Connor Doman
 */

import { base64ToUtf8, utf8ToBase64 } from "@lib/base64";

describe("base64ToUtf8", () => {
    it("should convert base64 to utf8", () => {
        const base64 = "SGVsbG8gV29ybGQ=";
        const utf8 = "Hello World";
        expect(base64ToUtf8(base64)).toBe(utf8);
    });
});

describe("utf8ToBase64", () => {
    it("should convert utf8 to base64", () => {
        const base64 = "SGVsbG8gV29ybGQ=";
        const utf8 = "Hello World";
        expect(utf8ToBase64(utf8)).toBe(base64);
    });
});
