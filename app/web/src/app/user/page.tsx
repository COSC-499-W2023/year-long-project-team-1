/*
 * Created on Thu Nov 02 2023
 * Author: Connor Doman
 */
import LinkButton from "@components/form/LinkButton";
import { ExampleUserCard } from "@components/user/ExampleUserCard";
import { getSession, getUserFromCookies } from "@lib/session";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";

// export const dynamic = "force-dynamic";

export default async function UserPage() {
    const user = await getUserFromCookies(cookies());

    if (!user) {
        return <main>Not logged in</main>;
    }

    return (
        <main>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <LinkButton href="/user/dashboard" label="Go to dashboard" />
                <LinkButton href="/user/update" label="Update your info" />
                <LinkButton href="/user/change_password" label="Change your password" />
                <br />
                <LinkButton href="/upload" label="Upload a video" />
            </div>
        </main>
    );
}
