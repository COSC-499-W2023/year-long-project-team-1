/*
 * Created on Thu Nov 02 2023
 * Author: Connor Doman
 */

import { DEBUG } from "@lib/config";
import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@lib/session";

// possible protected paths
const protectedPathSlugs = ["/user", "/staff", "/api"];

// redirect if logged in
const loggedInRedirectPathSlugs = ["/login", "/register"];

// debug pages
const debugPages = ["/api/auth/hash"];

export async function middleware(req: NextRequest) {
    // break down url
    const pathname = req.nextUrl.pathname;
    const fullUrl = new URL(req.nextUrl.toString());
    const url = `${fullUrl.protocol}//${fullUrl.host}`;

    // determine if the current path is to be protected, including all API routes except login
    const requiresAuth = protectedPathSlugs.some(
        (slug) => pathname.startsWith(slug) && !pathname.startsWith("/api/auth/login")
    );

    // if the route requires basic auth and does not have an auth header, redirect to login
    if (requiresAuth) {
        // look for session
        console.log("Middleware requires user for " + pathname);
        const user = await getSession();

        if (user?.isLoggedIn) {
            console.log("Middleware found user.");

            if (loggedInRedirectPathSlugs.some((slug) => pathname.startsWith(slug))) {
                console.log("Middleware requires authed users to redirect for " + pathname);
                return NextResponse.redirect(`${url}/`, { status: 302 });
            }
            console.log("Middleware allowing user to continue: " + user.email);
            return NextResponse.next();
        }
        console.log("Middleware did not find user.");
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
