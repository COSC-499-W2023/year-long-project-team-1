/*
 * Created on Mon Oct 23 2023
 * Author: Connor Doman
 */
"use client";

import LoginFlow from "@components/auth/LoginFlow";
import React from "react";

export default function LoginPage() {
    return (
        <main>
            <LoginFlow redirectUrl="/video-upload" />
        </main>
    );
}
