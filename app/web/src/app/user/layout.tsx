/*
 * Created on Sun Nov 12 2023
 * Author: Connor Doman
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserFromCookies } from "@lib/session";

interface UserLayoutProps {
    children?: React.ReactNode;
}

export default async function UserLayout({ children }: UserLayoutProps) {
    const user = await getUserFromCookies(cookies());

    if (!user) {
        console.log("[UserLayout] User not logged in, redirecting to login page");
        // redirect(`/login?r=${encodeURIComponent()}`);
    }

    return <>{children}</>;
}
