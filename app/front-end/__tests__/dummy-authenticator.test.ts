/*
 * Created on Sun Oct 29 2023
 * Author: Connor Doman
 */

import { utf8ToBase64 } from "@lib/base64";
import { DummyAuthenticator } from "@lib/dummy-authenticator";

describe("Dummy Authenticator", () => {
    it("works for valid credentials", async () => {
        const dummyAuthenticator = new DummyAuthenticator();
        const credentials = { email: "johnny@example.com", password: "password" };
        const user = await dummyAuthenticator.authorize(credentials, {} as any);
        expect(user).toEqual({
            id: "1",
            email: "johnny@example.com",
        });
    });

    it("fails for invalid credentials", async () => {
        const dummyAuthenticator = new DummyAuthenticator();
        const credentials = { email: "johnny@example.com", password: "wrongpassword" };
        const user = await dummyAuthenticator.authorize(credentials, {} as any);
        expect(user).toEqual(null);
    });

    it("contains 'credentials' profile name", () => {
        const dummyAuthenticator = new DummyAuthenticator();
        expect(dummyAuthenticator.name).toEqual("credentials");
    });

    it("contains correct credentials profile", () => {
        const dummyAuthenticator = new DummyAuthenticator();
        expect(dummyAuthenticator.credentials).toEqual({
            email: { label: "Email", type: "text", placeholder: "Email" },
            password: { label: "Password", type: "password" },
        });
    });

    it("authentication fails if hashedPassword is empty", async () => {
        const dummyAuthenticator = new DummyAuthenticator();
        const credentials = { email: "badatpasswords@example.com", password: "password" };
        const user = await dummyAuthenticator.authorize(credentials, {} as any);
        expect(user).toEqual(null);
    });

    it("authentication fails if empty password is provided", async () => {
        const dummyAuthenticator = new DummyAuthenticator();
        const credentials = { email: "johnny@example.com", password: "" };
        const user = await dummyAuthenticator.authorize(credentials, {} as any);
        expect(user).toEqual(null);
    });
});
