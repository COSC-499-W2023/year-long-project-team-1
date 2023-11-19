/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */
"use client";

import { getAuthSession, isLoggedIn } from "@app/actions";
import { JSONResponse } from "@lib/json";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface LoginLogoutProps {
    className?: string;
    style?: React.CSSProperties;
}

export const LoginLogout = ({ className, style }: LoginLogoutProps) => {
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    const { data: sessionStatus } = useSWR<JSONResponse>("/api/auth/session", (url: string) =>
        fetch(url, { cache: "no-store" }).then((r) => r.json())
    );

    useEffect(() => {
        if (!sessionStatus) {
            return;
        }

        const { errors, data } = sessionStatus;
        if (errors) {
            // console.error("Error in LoginLogout:", errors);
            setLoggedIn(false);
        } else if (data) {
            // console.log(data);
            setLoggedIn(true);
        }
        setLoading(false);
    }, [sessionStatus]);

    if (loading) {
        return <span>Loading...</span>;
    }

    if (!loggedIn) {
        return (
            <Link href="/login" style={style}>
                Log in
            </Link>
        );
    }

    return (
        <Link href="/logout" prefetch={false} style={style}>
            Log out
        </Link>
    );
};
