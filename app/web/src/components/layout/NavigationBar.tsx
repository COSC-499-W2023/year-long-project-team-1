"use client";

import {
  Masthead,
  MastheadToggle,
  MastheadMain,
  MastheadBrand,
  MastheadContent,
  Button,
} from "@patternfly/react-core";
import BarsIcon from "@patternfly/react-icons/dist/js/icons/bars-icon";
import Link from "next/link";
import PrivacyPalLogo from "./PrivacyPalLogo";
import { LoginLogout } from "@components/auth/link/LoginLogout";
import { User } from "next-auth";

const styles = {
  navbar: {
    width: "100%",
  },
  logo: {
    margin: "0.5rem 0",
  },
  content: {
    justifySelf: "flex-end",
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
  return (
    <Masthead style={{ ...styles.navbar, ...style }} className={className}>
      <MastheadToggle>
        <Button
          variant="plain"
          onClick={() => {}}
          aria-label="Global navigation"
        >
          <BarsIcon />
        </Button>
      </MastheadToggle>
      <MastheadMain>
        <MastheadBrand component={(props) => <Link {...props} href="/" />}>
          <PrivacyPalLogo style={styles.logo} w={48} h={48} dark={false} />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent style={styles.content}>
        <LoginLogout user={user} />
      </MastheadContent>
    </Masthead>
  );
}
