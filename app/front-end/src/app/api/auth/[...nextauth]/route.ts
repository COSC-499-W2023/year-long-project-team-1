/*
 * Created on Sun Oct 22 2023
 * Author: Connor Doman
 */

import { privacyPalAuthOptions } from "@lib/auth";
import NextAuth from "next-auth";

const authHandler = NextAuth(privacyPalAuthOptions);

export { authHandler as GET, authHandler as POST };
