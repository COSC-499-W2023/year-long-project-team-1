/*
 * Created on Thu Nov 02 2023
 * Author: Connor Doman
 */

import { NextRequest, NextResponse } from "next/server";
// possible protected paths
const protectedPathSlugs = ["/user", "/staff", "/api"];

export async function middleware(req: NextRequest) {
    // extract headers
    const requestHeaders = new Headers(req.headers);
    const authorizationHeader = requestHeaders.get("authorization");

    // break down url
    const pathname = req.nextUrl.pathname;
    const fullUrl = new URL(req.nextUrl.toString());
    const url = `${fullUrl.protocol}//${fullUrl.host}`;

    // determine if the current path is to be protected, including all API routes except auth
    const requiresAuth = protectedPathSlugs.some(
        (slug) => pathname.startsWith(slug) && !pathname.startsWith("/api/auth")
    );

    // if the route requires basic auth and does not have an auth header, redirect to login
    // TODO: change authorizationHeader to result of JWT status check
    if (requiresAuth && !authorizationHeader) {
        return NextResponse.redirect(`${url}/login?r=${encodeURIComponent(pathname)}`, { status: 302 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/:path*",
};
