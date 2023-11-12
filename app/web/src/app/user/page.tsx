/*
 * Created on Thu Nov 02 2023
 * Author: Connor Doman
 */
import { ExampleUserCard } from "@components/user/ExampleUserCard";
import { getSession } from "@lib/session";
import React from "react";

export const dynamic = "force-dynamic";

export default async function UserPage() {
    const user = await getSession();

    if (!user) {
        return <main>Not logged in</main>;
    }

    return (
        <main>
            <ExampleUserCard user={user} />
        </main>
    );
}
