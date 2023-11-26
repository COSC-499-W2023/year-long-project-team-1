/*
 * Created on Thu Nov 02 2023
 * Author: Connor Doman
 */

import { DEBUG } from "@lib/config";
import { NextRequest, NextResponse } from "next/server";
// possible protected paths
const protectedPathSlugs = ["/user", "/staff", "/api"];

// TODO: remove this when sessions are merged
const explicitlyUnprotectedPaths: string[] = ["/api/auth/", "/api/users"];

// debug pages
const debugPages = ["/api/auth/hash"];

export async function middleware(req: NextRequest) {
    // break down url
    const pathname = req.nextUrl.pathname;
    const fullUrl = new URL(req.nextUrl.toString());
    const url = `${fullUrl.protocol}//${fullUrl.host}`;

    // determine if the current path is to be protected, including all API routes except auth
    const requiresAuth = protectedPathSlugs.some(
        (slug) =>
            pathname.startsWith(slug) &&
            !explicitlyUnprotectedPaths.some((explicitlyUnprotectedPath) =>
                pathname.startsWith(explicitlyUnprotectedPath)
            )
    );

    // if the route requires basic auth and does not have an auth header, redirect to login
    // TODO: change authorizationHeader to result of JWT status check
    if (requiresAuth) {
        return NextResponse.redirect(`${url}/login?r=${encodeURIComponent(pathname)}`, { status: 302 });
    }

    // if the route is a debug page and debug is disabled, 404
    if (!DEBUG && debugPages.some((slug) => pathname.startsWith(slug))) {
        return NextResponse.redirect(`${url}/not-found`, { status: 302 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/:path*",
};
