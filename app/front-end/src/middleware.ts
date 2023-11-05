/*
 * Created on Thu Nov 02 2023
 * Author: Connor Doman
 */

import { NextRequest, NextResponse } from "next/server";
import { privacyPalAuthManager } from "@lib/auth";

// possible protected paths
const protectedPathSlugs = ["/user", "/staff"];

export async function middleware(req: NextRequest) {
    const requestHeaders = new Headers(req.headers);
    const authorizationHeader = requestHeaders.get("authorization");

    const pathname = req.nextUrl.pathname;
    const fullUrl = new URL(req.nextUrl.toString());
    const url = `${fullUrl.protocol}//${fullUrl.host}`;

    const requiresAuth = protectedPathSlugs.some((slug) => pathname.startsWith(slug));

    if (requiresAuth && !authorizationHeader) {
        return NextResponse.redirect(`${url}/login?r=${encodeURIComponent(pathname)}`, { status: 302 });
    }

    if (authorizationHeader) {
        const isBasicAuthHeader = authorizationHeader.startsWith("Basic ");
        if (isBasicAuthHeader && privacyPalAuthManager === "basic") {
            const authResponse = await fetch(`${url}/api/auth/basic`, {
                method: "POST",
                headers: {
                    authorization: authorizationHeader,
                },
            });

            if (authResponse.ok) {
                console.log("Authorization header, authorized");

                // TODO: Set cookie here or in API route

                return NextResponse.next();
            }
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
