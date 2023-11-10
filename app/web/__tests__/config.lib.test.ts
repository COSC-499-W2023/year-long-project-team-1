/*
 * Created on Mon Oct 30 2023
 * Author: Connor Doman
 */

import { extractBasicUserRecords } from "@lib/config";

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
});
