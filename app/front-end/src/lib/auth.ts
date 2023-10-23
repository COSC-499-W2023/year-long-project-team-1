/*
 * Created on Sun Oct 22 2023
 * Author: Connor Doman
 */

import type { NextAuthOptions, RequestInternal, User } from "next-auth";
import CredentialsProvider, { CredentialsConfig } from "next-auth/providers/credentials";

export type PrivacyPalCredentialsRecord = Record<"password" | "email", string> | undefined;
export type AuthRequest = Pick<RequestInternal, "body" | "query" | "headers" | "method">;

export const privacyPalAuthOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password" },
            },
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
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET ?? "",
};
