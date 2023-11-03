/*
 * Created on Sun Oct 22 2023
 * Author: Connor Doman
 */

import { privacyPalAuthOptions } from "@lib/auth";
import { RESPONSE_NOT_IMPLEMENTED } from "@lib/json";
import NextAuth from "next-auth";

const authHandler = NextAuth(privacyPalAuthOptions);

// export { authHandler as GET, authHandler as POST };
export async function GET(req: Request) {
    return Response.json(RESPONSE_NOT_IMPLEMENTED, { status: 501 });
}
