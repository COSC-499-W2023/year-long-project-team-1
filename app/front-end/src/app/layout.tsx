import type { Metadata } from "next";
import NextAuthProvider from "@components/auth/NextAuthProvider";

import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "PrivacyPal",
    description: "COSC 499 Capstone Team 1 2023W1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <NextAuthProvider>{children}</NextAuthProvider>
            </body>
        </html>
    );
}
