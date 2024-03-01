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

import {
  Masthead,
  MastheadMain,
  MastheadBrand,
  MastheadContent,
} from "@patternfly/react-core";
import Link from "next/link";
import PrivacyPalLogo from "./PrivacyPalLogo";
import { LoginLogout } from "@components/auth/button/LoginLogout";
import { User } from "next-auth";
import ProfilePicture from "./ProfilePicture";

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "var(--pf-v5-global--primary-color--100)",
    padding: "0.25rem 1rem",
    color: "var(--pf-v5-global--Color--light-100)",
  },
  main: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
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
    gap: "1rem",
  },
};

interface NavigationBarProps {
  user?: User;
  className?: string;
  style?: React.CSSProperties;
}

export default function NavigationBar({
  user,
  className,
  style,
}: NavigationBarProps) {
  // TODO: enable masthead toggle
  return (
    <header style={{ ...styles.navbar, ...style }} className={className}>
      {/* <MastheadToggle>
        <Button
          variant="plain"
          onClick={() => {}}
          aria-label="Global navigation"
        >
          <BarsIcon />
        </Button>
      </MastheadToggle> */}
      <div style={styles.main}>
        <Link href="/" style={styles.link}>
          {/* <MastheadBrand component={(props) => <Link {...props} href="/" />}> */}
          <PrivacyPalLogo style={styles.logo} w={48} h={48} dark={false} />
          {/* </MastheadBrand> */}
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
