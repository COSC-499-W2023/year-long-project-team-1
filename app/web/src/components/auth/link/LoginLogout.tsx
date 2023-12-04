/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */

import { getAuthSession } from "@app/actions";
import { PrivacyPalAuthUser } from "@lib/auth";
import Link from "next/link";

interface LoginLogoutProps {
    user?: PrivacyPalAuthUser;
    className?: string;
    style?: React.CSSProperties;
}

export const LoginLogout = async ({ className, style }: LoginLogoutProps) => {
    const user = await getAuthSession();

    if (!user) {
        return (
            <>
                <Link href="/login" prefetch={false} style={style} className={className}>
                    Log in
                </Link>
                <Link href="/signup" prefetch={false} style={style} className={className}>
                    Sign Up
                </Link>
            </>
        );
    }

    return (
        <Link href="/logout" style={style} className={className}>
            Log out
        </Link>
    );
};
