/*
 * Created on Mon Oct 23 2023
 * Author: Connor Doman
 */
"use client";

import { PalLoginPage } from "@components/auth/LoginForm";
import { PalTextInput } from "@components/form/PalTextInput";
import { Button } from "@patternfly/react-core";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

const LoginFlowComponent = () => {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (status === "authenticated") {
        return (
            <div>
                <h1>You are logged in</h1>
                <pre>{JSON.stringify(session, null, 4)}</pre>
                <Button onClick={() => signOut()}>Sign out</Button>
            </div>
        );
    }

    return (
        <div>
            <PalLoginPage />
        </div>
    );
};

export default function LoginPage() {
    return (
        <main>
            <LoginFlowComponent />
        </main>
    );
}
