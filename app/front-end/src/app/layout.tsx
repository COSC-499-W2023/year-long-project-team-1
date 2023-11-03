import type { Metadata } from "next";
import NextAuthProvider from "@components/auth/NextAuthProvider";

import "@patternfly/react-core/dist/styles/base.css";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "@components/Footer";
import { Header } from "@components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "PrivacyPal",
    description: "COSC 499 Capstone Team 1 2023W1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {/* <NextAuthProvider> */}
                <Header />
                {children}
                <Footer />
                {/* </NextAuthProvider> */}
            </body>
        </html>
    );
}
