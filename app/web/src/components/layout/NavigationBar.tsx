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
import Link from "next/link";
import PrivacyPalLogo from "./PrivacyPalLogo";
import { User } from "next-auth";
import ProfilePicture from "./ProfilePicture";
import BackButton from "./BackButton";
import { Stylesheet, CSS } from "@lib/utils";
import React from "react";
import { LoginButton } from "@components/auth/button/LoginButton";
import NavbarLinks from "./NavbarLinks";

const styles: Stylesheet = {
  navbar: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background:
      "linear-gradient(269.95deg, #CCE3EF 0.05%, rgba(161, 208, 232, 0.115702) 74.51%), rgba(255, 255, 255)",
    padding: "0.25rem 1rem",
    color: "var(--pf-v5-global--Color--light-100)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    margin: "0.5rem 0",
  },
  content: {
    display: "flex",
    gap: "1rem",
    justifySelf: "flex-end",
    alignItems: "center",
  },
  link: {
    color: "var(--pf-global--Color--200)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.75rem",
  },
  h1: {
    color: "#094886",
    fontWeight: "bold",
    marginRight: "1rem",
    marginLeft: "-0.5rem",
  },
  backButton: {
    marginLeft: "1rem",
  },
};

interface NavigationBarProps {
  user?: User;
  className?: string;
  style?: CSS;
}

export default function NavigationBar({
  user,
  className,
  style,
}: NavigationBarProps) {
  return (
    <header style={{ ...styles.navbar, ...style }} className={className}>
      <div style={styles.brand}>
        <a href="/" style={styles.link}>
          <PrivacyPalLogo style={styles.logo} w={48} h={48} dark={true} />
          <h1 style={styles.h1}>PrivacyPal</h1>
        </a>
        <BackButton style={styles.backButton} />
      </div>

      <div style={styles.content}>
        <NavbarLinks user={user} />
        {user ? <ProfilePicture user={user} /> : <LoginButton />}
      </div>
    </header>
  );
}
