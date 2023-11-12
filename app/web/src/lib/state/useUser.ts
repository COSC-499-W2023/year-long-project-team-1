/*
 * Created on Thu Nov 09 2023
 * Author: Connor Doman
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { PrivacyPalAuthUser } from "@lib/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getSession } from "@lib/session";

interface UseUserOptions {
    customUser?: PrivacyPalAuthUser;
    redirectTo?: string;
    redirectIfFound?: boolean;
    customRouter?: AppRouterInstance;
}

// A modified version of Next.js's iron-session example
// https://github.com/vercel/next.js/blob/canary/examples/with-iron-session/lib/useUser.ts
export default function useUser({ redirectTo = "", redirectIfFound = false, customRouter }: UseUserOptions = {}) {
    const router = customRouter ?? useRouter();
    const { data: user, mutate: setUser } = useSWR<PrivacyPalAuthUser>("/api/auth/session", (url: string) =>
        fetch(url).then((r) => r.json())
    );
    // const [user, setUser] = useState<PrivacyPalAuthUser | null>(null);

    useEffect(() => {
        // if no redirect needed, just return (example: already on /dashboard)
        // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
        if (!redirectTo || !user) return;

        if (
            // If redirectTo is set, redirect if the user was not found.
            (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
            // If redirectIfFound is also set, redirect if the user was found
            (redirectIfFound && user.isLoggedIn)
        ) {
            router.push(redirectTo);
        }
    }, [user, redirectIfFound, redirectTo]);

    return { user, setUser };
}
