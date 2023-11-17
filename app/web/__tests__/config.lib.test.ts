/*
 * Created on Mon Oct 30 2023
 * Author: Connor Doman
 */

import { ENVIRONMENT, IS_PRODUCTION, extractBasicUserRecords } from "@lib/config";

describe("Config", () => {
    it("contains a user config", () => {
        const config = extractBasicUserRecords();
        const userArray = config.users;
        expect(typeof userArray).toEqual("object");
        expect(userArray.length).toBeGreaterThan(0);
    });

    it("contains a user config with an email", () => {
        const config = extractBasicUserRecords();
        const userArray = config.users;
        expect(userArray[0].email).toBeDefined();
    });

    it("should have environment set to 'test'", () => {
        const config = extractBasicUserRecords();
        expect(IS_PRODUCTION).toEqual(false);
        expect(ENVIRONMENT).toEqual("test");
    });
});
