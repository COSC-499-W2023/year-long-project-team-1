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
import Image from "next/image";
import logo from "@assets/logo.png";
import Link from "next/link";
import { LoginLogout } from "@components/auth/link/LoginLogout";
import { getAuthSession } from "@app/actions";

const style = {
  header: {
    backgroundColor: "var(--pf-v5-global--primary-color--100)",
    textAlign: "center",
    height: "fit-content",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "0",
    position: "sticky",
    top: "0",
    zIndex: "1000",
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
    backgroundColor: "var(--pf-v5-global--primary-color--100)",
    gap: "1rem",
  },
  link: {
    color: "white",
    textDecoration: "underline",
  },
};

export const Header = async () => {
  const user = await getAuthSession();

  return (
    <header style={style.header}>
      <div style={style.loginLinks}>
        <LoginLogout user={user} style={style.link} />
      </div>
      <Link href="/">
        <Image alt="logo" style={style.logo} src={logo} />
      </Link>
      <div>
        <h1 style={style.text}>
          A SOLUTION TO ABSOLUTE{" "}
          <span style={{ color: "#F58658" }}>PRIVACY.</span>
        </h1>
      </div>
    </header>
  );
};
