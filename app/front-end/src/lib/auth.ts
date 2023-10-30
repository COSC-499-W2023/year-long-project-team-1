/*
 * Created on Sun Oct 22 2023
 * Author: Connor Doman
 */

import bcrypt from "bcrypt";
import type { NextAuthOptions, RequestInternal, User } from "next-auth";
import CredentialsProvider, { CredentialsConfig } from "next-auth/providers/credentials";
import { DummyAuthenticator } from "./dummy-authenticator";

export type PrivacyPalCredentialsRecord = Record<"password" | "email", string> | undefined;
export type AuthRequest = Pick<RequestInternal, "body" | "query" | "headers" | "method">;

export interface PrivacyPalAuthenticator {
    name: CredentialsConfig["name"];
    credentials: CredentialsConfig["credentials"];
    authorize: (credentials: PrivacyPalCredentialsRecord, req: AuthRequest) => Promise<User | null>;
}

const buildAuthenticationProviders = () => {
    const manager = (process.env.PRIVACYPAL_AUTH_MANAGER ?? "basic") as "basic" | "aws_cognito";

    switch (manager) {
        case "aws_cognito":
        case "basic":
            const dummyProvider = new DummyAuthenticator();

            return CredentialsProvider({
                name: dummyProvider.name,
                credentials: dummyProvider.credentials,
                authorize: dummyProvider.authorize,
            });
        default:
            throw new Error(`Invalid authentication manager: ${manager}`);
    }
};

export const privacyPalAuthOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [buildAuthenticationProviders()],
    secret: process.env.NEXTAUTH_SECRET ?? "",
};
