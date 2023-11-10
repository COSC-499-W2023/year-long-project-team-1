/*
 * Created on Sun Oct 29 2023
 * Author: Connor Doman
 */

import { utf8ToBase64 } from "@lib/base64";
import { DummyBasicAuthenticator } from "@lib/dummy-authenticator";

describe("Dummy Authenticator", () => {
    it("works for valid credentials", async () => {
        const dummyAuthenticator = new DummyBasicAuthenticator();
        const credentials = { email: "johnny@example.com", password: "password" };
        const user = await dummyAuthenticator.authorize(credentials);
        expect(user).toEqual({
            id: "1",
            email: "johnny@example.com",
        });
    });

    it("fails for invalid credentials", async () => {
        const dummyAuthenticator = new DummyBasicAuthenticator();
        const credentials = { email: "johnny@example.com", password: "wrongpassword" };
        const user = await dummyAuthenticator.authorize(credentials);
        expect(user).toEqual(null);
    });

    it("authentication fails if hashedPassword is empty", async () => {
        const dummyAuthenticator = new DummyBasicAuthenticator();
        const credentials = { email: "badatpasswords@example.com", password: "password" };
        const user = await dummyAuthenticator.authorize(credentials);
        expect(user).toEqual(null);
    });

    it("authentication fails if empty password is provided", async () => {
        const dummyAuthenticator = new DummyBasicAuthenticator();
        const credentials = { email: "johnny@example.com", password: "" };
        const user = await dummyAuthenticator.authorize(credentials);
        expect(user).toEqual(null);
    });
});
