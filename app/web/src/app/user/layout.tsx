/*
 * Created on Sun Nov 12 2023
 * Author: Connor Doman
 */

import { getLoggedInUser } from "@app/actions";
import Link from "next/link";

const style = {
    headerBar: {
        width: "100%",
        padding: "0.5rem var(--w--1-24)",
        display: "flex",
        justifyContent: "flex-end",
        backgroundColor: "var(--pf-v5-global--primary-color--100)",
    },
    link: {
        color: "white",
        textDecoration: "underline",
    },
};

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
