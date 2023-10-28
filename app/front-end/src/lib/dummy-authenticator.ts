/*
 * Created on Fri Oct 27 2023
 * Author: Connor Doman
 */

import { User } from "next-auth";
import { AuthRequest, PrivacyPalAuthenticator, PrivacyPalCredentialsRecord } from "./auth";
import { CredentialsConfig } from "next-auth/providers/credentials";

export class DummyAuthenticator implements PrivacyPalAuthenticator {
    private _name: string;
    private _credentials: CredentialsConfig["credentials"];

    constructor() {
        this._name = "credentials";
        this._credentials = {
            email: { label: "Email", type: "text", placeholder: "Email" },
            password: { label: "Password", type: "password" },
        };
    }

    async authorize(credentials: PrivacyPalCredentialsRecord, req: AuthRequest): Promise<User | null> {
        const user: User = {
            id: "1",
            name: "Johnny Realcustomer",
            email: "johnny@example.com",
        };

        if (credentials?.email === "johnny@example.com" && credentials?.password === "password") {
            return user;
        }
        return null;
    }

    get name() {
        return this._name;
    }

    get credentials() {
        return this._credentials;
    }
}
