/*
 * Created on Sun Oct 22 2023
 * Author: Connor Doman
 */

import type { NextAuthOptions, RequestInternal, User } from "next-auth";
import CredentialsProvider, { CredentialsConfig } from "next-auth/providers/credentials";
import { DummyAuthenticator, PrivacyPalDummyUser } from "./dummy-authenticator";

export type PrivacyPalCredentialsRecord = Record<"password" | "email", string> | undefined;
export type AuthRequest = Pick<RequestInternal, "body" | "query" | "headers" | "method">;

export interface PrivacyPalAuthenticator {
    name: CredentialsConfig["name"];
    credentials: CredentialsConfig["credentials"];
    authorize: (credentials: PrivacyPalCredentialsRecord, req: AuthRequest) => Promise<User | null>;
}

const privacyPalAuthenticator = new DummyAuthenticator();

export const privacyPalAuthOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: privacyPalAuthenticator.name,
            credentials: privacyPalAuthenticator.credentials,
            authorize: privacyPalAuthenticator.authorize,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET ?? "",
};
