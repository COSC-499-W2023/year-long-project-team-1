/*
 * Created on Sun Oct 22 2023
 * Author: Connor Doman
 */
"use client";

import { SessionProvider } from "next-auth/react";

interface NextAuthProviderProps {
    children?: React.ReactNode;
}

export const NextAuthProvider = ({ children }: NextAuthProviderProps) => {
    return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuthProvider;
