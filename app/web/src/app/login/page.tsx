/*
 * Created on Mon Oct 23 2023
 * Author: Connor Doman
 */
"use client";

import LoginFlow from "@components/auth/LoginFlow";
import React from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
    // get redirect url from query params
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("r");

    return (
        <main>
            <LoginFlow redirectUrl={redirectUrl ? decodeURIComponent(redirectUrl) : undefined} />
        </main>
    );
}
