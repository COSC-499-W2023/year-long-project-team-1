import type { Metadata } from "next";

import "@patternfly/react-core/dist/styles/base.css";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "@components/layout/Footer";
import { Header } from "@components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

const style = {
    pageContent: {
        flexGrow: 1,
    },
};

export const metadata: Metadata = {
    title: "PrivacyPal",
    description: "COSC 499 Capstone Team 1 2023W1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Header />
                <div style={style.pageContent}>{children}</div>
                <Footer />
            </body>
        </html>
    );
}
