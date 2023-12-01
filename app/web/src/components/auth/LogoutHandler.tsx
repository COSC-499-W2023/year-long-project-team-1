/*
 * Created on Sun Nov 19 2023
 * Author: Connor Doman
 */
"use client";

import { clearAuthSession, logOut } from "@app/actions";
import { clearSession } from "@lib/session";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LogoutHandler() {
    const router = useRouter();
    const [loggedOut, setLoggedOut] = useState(false);

    useEffect(() => {
        const logout = async () => {
            const loggedOut = await clearAuthSession();
            setLoggedOut(loggedOut);
        };
        logout();
    }, []);

    useEffect(() => {
        router.push("/");
    }, [loggedOut]);

    return <main>Logging out...</main>;
}
