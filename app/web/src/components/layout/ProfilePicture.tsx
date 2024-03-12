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
"use client";

import { Avatar } from "@patternfly/react-core";
import avatarImg from "@assets/pf_avatar.svg";
import { User } from "next-auth";
import Link from "next/link";
import { CSS, Stylesheet } from "@lib/utils";

const styles: Stylesheet = {
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
  style?: CSS;
  width?: string;
  link?: string;
}

export default function ProfilePicture({
  user,
  tooltip,
  className,
  style,
  width,
  link,
}: ProfilePictureProps) {
  // link to dashboard in place of user profile
  const avatar = (
    <Link
      href={link ?? "/uprofile"}
      style={{ ...styles.link, ...style }}
      title={tooltip}
    >
      <Avatar
        src={user.image || avatarImg.src}
        alt="Profile picture"
        size="md"
        className={className}
        style={{ ...styles.avatar, width, height: width }}
      />
      <span style={styles.username}>{user.username}</span>
      <span style={styles.role}>{user.role}</span>
    </Link>
  );

  return avatar;
}
