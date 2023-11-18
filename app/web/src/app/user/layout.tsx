/*
 * Created on Sun Nov 12 2023
 * Author: Connor Doman
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserFromCookies } from "@lib/session";
import { getLoggedInUser } from "@app/actions";

interface UserLayoutProps {
    children?: React.ReactNode;
}

export default async function UserLayout({ children }: UserLayoutProps) {
    // const user = await getUserFromCookies(cookies());
    const user = await getLoggedInUser();

    if (!user) {
        console.log("[UserLayout] User not logged in, redirecting to login page");
        // redirect(`/login?r=${encodeURIComponent()}`);
    }

    return <>{children}</>;
}
