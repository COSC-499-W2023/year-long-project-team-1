/*
 * Created on Mon Oct 30 2023
 * Author: Connor Doman
 */
"use client";
import { Button } from "@patternfly/react-core";
import { signOut, useSession } from "next-auth/react";
import { PalLoginPage } from "./LoginForm";

export const LoginFlow = () => {
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

export default LoginFlow;
