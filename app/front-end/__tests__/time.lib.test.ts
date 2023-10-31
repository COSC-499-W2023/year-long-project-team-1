/*
 * Created on Thu Oct 26 2023
 * Author: Connor Doman
 */

import { timeStampUTC } from "@lib/time";

describe("timeStampUTC", () => {
    it("should return a string in the form <YYYYMMDD>T<HHmmss>", () => {
        const result = timeStampUTC();
        const regex = /^\d{8}T\d{6}$/;
        expect(regex.test(result)).toBe(true);
    });

    it("should return the current time in UTC", () => {
        const control = new Date("2023-10-26T00:00:00.000Z");
        const result = timeStampUTC(control);
        const controlUTC = "20231026T000000";
        expect(result).toBe(controlUTC);
    });
});
