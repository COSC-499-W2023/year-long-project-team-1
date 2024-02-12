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

"use server";

import Link from "next/link";
import { LoginLogout } from "@components/auth/link/LoginLogout";
import NavigationBar from "./NavigationBar";
import PrivacyPalLogo from "./PrivacyPalLogo";

const style = {
  header: {
    // backgroundColor: "var(--pf-v5-global--primary-color--100)",
    textAlign: "center",
    height: "fit-content",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "0",
    // position: "sticky",
    top: "0",
    zIndex: "1",
  } as React.CSSProperties,
  logo: {
    maxWidth: "6rem",
    height: "auto",
  },
  text: {
    fontSize: "30px",
    fontWeight: "bolder",
    color: "white",
    margin: "0.5rem 0",
  },
  loginLinks: {
    width: "100%",
    padding: "0.5rem 1rem",
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",
  },
  link: {
    color: "var(--pf-v5-global--primary-color--100)",
    textDecoration: "underline",
  },
};

export const Header = async () => {
  // const user = await getAuthSession();

  return (
    <header style={style.header}>
      <NavigationBar />
      <div style={style.loginLinks}>
        <LoginLogout />
      </div>
      <Link href="/">
        <PrivacyPalLogo />
      </Link>
    </header>
  );
};
