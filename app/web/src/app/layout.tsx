/*
 * Copyright [2023] [Privacypal Authors]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
