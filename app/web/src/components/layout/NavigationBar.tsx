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
import { LoginLogout } from "@components/auth/button/LoginLogout";
import { User } from "next-auth";
import ProfilePicture from "./ProfilePicture";
import { Stylesheet, CSS } from "@lib/utils";

const styles: Stylesheet = {
  navbar: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "var(--pf-v5-global--primary-color--100)",
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
        <Link href="/" style={styles.link}>
          <PrivacyPalLogo style={styles.logo} w={48} h={48} dark={false} />
          Home
        </Link>
      </div>
      <div style={styles.content}>
        <LoginLogout />
        {user ? (
          <ProfilePicture
            tooltip={`Logged in as ${user.username}`}
            user={user}
          />
        ) : null}
      </div>
    </header>
  );
}
