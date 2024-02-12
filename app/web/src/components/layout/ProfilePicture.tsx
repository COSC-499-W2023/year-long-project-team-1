"use client";

import { Avatar, Tooltip } from "@patternfly/react-core";
import avatarImg from "@assets/pf_avatar.svg";
import { User } from "next-auth";
import Link from "next/link";

const styles: { [key: string]: React.CSSProperties } = {
  avatar: {
    cursor: "pointer",
  },
  link: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "var(--pf-global--Color--200)",
    margin: "0.5rem 0",
    textDecoration: "none",
  },
  username: {
    fontSize: "0.75rem",
    fontWeight: "bold",
  },
  role: {
    fontSize: "0.66rem",
    fontWeight: "lighter",
    textTransform: "capitalize",
  },
};

interface ProfilePictureProps {
  user: User;
  tooltip?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ProfilePicture({
  user,
  tooltip,
  className,
  style,
}: ProfilePictureProps) {
  // link to dashboard in place of user profile
  const avatar = (
    <Link href="/user/dashboard" style={styles.link} title={tooltip}>
      <Avatar
        src={avatarImg.src}
        alt="Profile picture"
        size="md"
        className={className}
        style={{ ...styles.avatar, ...style }}
      />
      <span style={styles.username}>{user.username}</span>
      <span style={styles.role}>{user.role}</span>
    </Link>
  );

  return avatar;
}
