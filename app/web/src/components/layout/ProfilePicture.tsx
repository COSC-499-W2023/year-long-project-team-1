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

import {
  Avatar,
  Divider,
  List,
  ListItem,
  Popover,
} from "@patternfly/react-core";
import avatarImg from "@assets/pf_avatar.svg";
import { User } from "next-auth";
import Link from "next/link";
import { CSS, Stylesheet } from "@lib/utils";
import { useState } from "react";
import { SignOutAltIcon, UserIcon } from "@patternfly/react-icons";
import { signOut } from "next-auth/react";

const styles: Stylesheet = {
  avatar: {
    cursor: "pointer",
  },
};

interface ProfilePictureProps {
  user: User;
  className?: string;
  style?: CSS;
  width?: string;
  link?: string;
}

export default function ProfilePicture({
  user,
  className,
  width,
}: ProfilePictureProps) {
  const [showMenu, setShowMenu] = useState(false);
  const avatar = (size: "md" | "lg" | "sm" | "xl") => (
    <Avatar
      src={user.image || avatarImg.src}
      alt="Profile picture"
      size={size}
      className={className}
      style={{ ...styles.avatar, width, height: width }}
    />
  );

  const headContent = (
    <div>
      <div style={{ fontSize: "18px" }}>
        {user.firstName + " " + user.lastName}
      </div>
      <div style={{ fontSize: "13px", fontWeight: "unset", color: "gray" }}>
        {user.email}
        <br />
        {user.role}
      </div>
    </div>
  );
  const bodyContent = (
    <List isPlain>
      <Divider style={{ marginBottom: "10px" }} />
      <ListItem icon={<UserIcon />}>
        <Link href={"/profile"} onClick={() => setShowMenu(false)}>
          Profile
        </Link>
      </ListItem>
      <ListItem icon={<SignOutAltIcon />}>
        <Link
          href={""}
          onClick={() => {
            setShowMenu(false);
            signOut({ callbackUrl: "/api/auth/logout" });
          }}
        >
          Sign out
        </Link>
      </ListItem>
    </List>
  );
  return (
    <Popover
      bodyContent={bodyContent}
      headerContent={headContent}
      headerIcon={avatar("lg")}
      position="bottom-end"
      isVisible={showMenu}
      shouldOpen={() => setShowMenu(true)}
      shouldClose={() => setShowMenu(false)}
    >
      {avatar("md")}
    </Popover>
  );
}
