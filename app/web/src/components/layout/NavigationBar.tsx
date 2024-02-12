"use client";

import {
  Masthead,
  MastheadToggle,
  MastheadMain,
  MastheadBrand,
  MastheadContent,
  Button,
  Brand,
} from "@patternfly/react-core";
import BarsIcon from "@patternfly/react-icons/dist/js/icons/bars-icon";
import Link from "next/link";
import pfIcon from "../../assets/pf-logo.svg";
import PrivacyPalLogo from "./PrivacyPalLogo";

const styles = {
  navbar: {
    width: "100%",
    backgroundColor: "var(--pf-v5-global--primary-color--100)",
  },
};

interface NavigationBarProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function NavigationBar({
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
          <PrivacyPalLogo />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <span>Content</span>
      </MastheadContent>
    </Masthead>
  );
}
