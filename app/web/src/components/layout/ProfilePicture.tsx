"use client";

import { Avatar, Tooltip } from "@patternfly/react-core";
import avatarImg from "@assets/pf_avatar.svg";
import { User } from "next-auth";
import Link from "next/link";

const styles = {
  avatar: {
    cursor: "pointer",
  },
  link: {
    display: "flex",
    alignItems: "center",
  },
};

interface ProfilePictureProps {
  user: User;
  tooltip?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ProfilePicture({
  tooltip,
  className,
  style,
}: ProfilePictureProps) {
  // link to dashboard in place of user profile
  const avatar = (
    <Link href="/user/dashboard" style={styles.link}>
      <Avatar
        src={avatarImg.src}
        alt="Profile picture"
        size="md"
        className={className}
        style={{ ...styles.avatar, ...style }}
      />
    </Link>
  );

  if (tooltip) {
    return (
      <Tooltip content={<div>{tooltip}</div>} position="bottom-end">
        {avatar}
      </Tooltip>
    );
  }

  return avatar;
}
