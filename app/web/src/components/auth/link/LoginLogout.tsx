/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */
"use client";

import { getAuthSession, isLoggedIn } from "@app/actions";
import Link from "next/link";
import { useEffect, useState } from "react";

export const LoginLogout = () => {
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        isLoggedIn().then((status) => {
            setLoggedIn(status);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <span>Loading...</span>;
    }

    if (!loggedIn) {
        return <Link href="/login">Log in</Link>;
    }

    return (
        <Link href="/logout" prefetch={false}>
            Log out
        </Link>
    );
};
