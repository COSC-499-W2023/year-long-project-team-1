/*
 * Created on Thu Nov 02 2023
 * Author: Connor Doman
 */

import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { extractBasicCredentials, privacyPalAuthManager } from "@lib/auth";
import { base64ToUtf8 } from "@lib/base64";

export function middleware(req: NextRequest) {
    const headersList = headers();
    const authorizationHeader = headersList.get("authorization");

    const pathname = req.nextUrl.pathname;

    console.log(pathname);

    if (authorizationHeader) {
        const isBasicAuthHeader = authorizationHeader.startsWith("Basic ");
        if (isBasicAuthHeader && privacyPalAuthManager === "basic") {
            console.log("Basic auth header detected");

            const credentials = extractBasicCredentials(authorizationHeader);

            console.log({ credentials });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/:path*",
};
