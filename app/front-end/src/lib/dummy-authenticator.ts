/*
 * Created on Fri Oct 27 2023
 * Author: Connor Doman
 */

import bcrypt from "bcryptjs";
import { User } from "next-auth";
import { PrivacyPalAuthManager, PrivacyPalCredentials } from "./auth";
import { extractBasicUserRecords } from "./config";
import { JSONResponse, RESPONSE_NOT_AUTHORIZED } from "./json";

export interface PrivacyPalDummyUser {
    id: string;
    email: string;
    hashedPassword: string;
}

export class DummyBasicAuthenticator implements PrivacyPalAuthManager {
    async authorize(credentials: PrivacyPalCredentials): Promise<User | null> {
        // extract the user config from the JSON file
        const userConfig = extractBasicUserRecords() as { users: PrivacyPalDummyUser[] };
        const users: PrivacyPalDummyUser[] = userConfig.users;

        // search the recovered JSON for a user with the same email as the credentials
        const user = users.find((user) => user.email === credentials?.email) as PrivacyPalDummyUser;

        if (user) {
            // find the plain text password from the credentials
            const plainPassword = credentials?.password;

            if (!plainPassword) {
                console.error("Password not provided");
                return null;
            }

            // retrieve stored password
            const storedPassword = user.hashedPassword;

            if (!storedPassword) {
                console.error("Found user has no password");
                return null;
            }

            // convert stored password back to ASCII from base64
            // compare the plain text password with the hashed password
            const isPasswordValid = await bcrypt.compare(plainPassword, storedPassword);

            if (isPasswordValid) {
                return { id: user.id, email: user.email } as User;
            }
            console.error("Invalid password");
        } else {
            console.error("User not found");
        }
        // if credentials invalid in any way, return null
        return null;
    }
}
