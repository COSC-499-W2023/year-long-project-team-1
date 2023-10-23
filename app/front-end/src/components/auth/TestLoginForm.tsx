/*
 * Created on Sun Oct 22 2023
 * Author: Connor Doman
 */
"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export const TestLoginForm = () => {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (session?.user) {
        return (
            <>
                Signed in as {session.user.email}
                <br />
                <button onClick={() => signOut()}>Sign out</button>
            </>
        );
    } else {
        return (
            <>
                Not signed in <br />
                <button onClick={() => signIn()}>Sign in</button>
            </>
        );
    }
};

export default TestLoginForm;
