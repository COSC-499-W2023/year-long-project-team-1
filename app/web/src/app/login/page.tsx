/*
 * Created on Mon Oct 23 2023
 * Author: Connor Doman
 */
"use client";

import LoginFlow from "@components/auth/LoginFlow";
import React from "react";

export default function LoginPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // get redirect url from query params
    const redirectUrl = searchParams.r as string | undefined;

    return (
        <main>
            <LoginFlow redirectUrl={redirectUrl ? decodeURIComponent(redirectUrl) : undefined} />
        </main>
    );
}
