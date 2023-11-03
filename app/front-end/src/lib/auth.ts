/*
 * Created on Sun Oct 22 2023
 * Author: Connor Doman
 */

import type { NextAuthOptions, RequestInternal, User } from "next-auth";
import CredentialsProvider, { CredentialsConfig } from "next-auth/providers/credentials";
import { DummyAuthenticator } from "./dummy-authenticator";
import { base64ToUtf8 } from "./base64";

export type PrivacyPalAuthManager = "aws_cognito" | "basic" | undefined;
export type PrivacyPalCredentialsRecord = Record<"password" | "email", string> | undefined;
export type AuthRequest = Pick<RequestInternal, "body" | "query" | "headers" | "method">;

export interface PrivacyPalAuthenticator {
    name: CredentialsConfig["name"];
    credentials: CredentialsConfig["credentials"];
    authorize: (credentials: PrivacyPalCredentialsRecord, req: AuthRequest) => Promise<User | null>;
}

const buildAuthenticationProviders = () => {
    const manager = (process.env.PRIVACYPAL_AUTH_MANAGER ?? "basic") as PrivacyPalAuthManager;

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

export const privacyPalAuthManager: PrivacyPalAuthManager = process.env
    .PRIVACYPAL_AUTH_MANAGER as PrivacyPalAuthManager;

export const extractBasicCredentials = (authorizationHeader: string): PrivacyPalCredentialsRecord => {
    const isBasicAuthHeader = authorizationHeader.startsWith("Basic ");
    if (isBasicAuthHeader) {
        const base64Credentials = authorizationHeader.split(" ")[1];
        const credentials = base64ToUtf8(base64Credentials);
        const [email, password] = credentials.split(":");
        return { email, password };
    }
};

export const basicDummyAuthentication = async (authorizationHeader: string): Promise<User | false> => {
    const dummyProvider = new DummyAuthenticator();
    const authorizedUser = await dummyProvider.authorize(extractBasicCredentials(authorizationHeader));
    console.log({ authorizedUser });
    if (authorizedUser) {
        return authorizedUser;
    }
    return false;
};
