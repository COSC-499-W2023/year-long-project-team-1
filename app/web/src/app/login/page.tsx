/*
 * Created on Mon Oct 23 2023
 * Author: Connor Doman
 */

import LoginFlow from "@components/auth/LoginFlow";
import React, { Suspense } from "react";

export const dynamic = "force-dynamic";

const LoginFallback = () => {
    return <h1>Loading...</h1>;
};

export default function LoginPage() {
    return (
        <main>
            <Suspense fallback={<LoginFallback />}>
                <LoginFlow />
            </Suspense>
        </main>
    );
}
