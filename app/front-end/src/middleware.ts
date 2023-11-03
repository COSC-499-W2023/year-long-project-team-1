/*
 * Created on Thu Nov 02 2023
 * Author: Connor Doman
 */

import { NextRequest, NextResponse } from "next/server";
import { basicDummyAuthentication, extractBasicCredentials, privacyPalAuthManager } from "@lib/auth";

export async function middleware(req: NextRequest) {
    const requestHeaders = new Headers(req.headers);
    const authorizationHeader = requestHeaders.get("authorization");

    const pathname = req.nextUrl.pathname;

    // console.log(pathname);

    if (authorizationHeader) {
        const isBasicAuthHeader = authorizationHeader.startsWith("Basic ");
        if (isBasicAuthHeader && privacyPalAuthManager === "basic") {
            console.log("Basic auth header detected");

            // const authRequest = await basicDummyAuthentication(authorizationHeader);

            // console.log({ authRequest });

            // if (authRequest) {
            //     console.log("Authorization header, authorized");

            //     requestHeaders.set("x-privacypal-hello", "Hello from authorization land!");
            //     return NextResponse.next();
            // }
        }

        console.log("Authorization header, not authorized");
        requestHeaders.set("WWW-Authenticate", 'Basic realm="Access to the staging site", charset="UTF-8"');
        return NextResponse.next({ status: 401, headers: requestHeaders });
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/:path*",
};
