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
import React from "react";
import { User } from "next-auth";
import { UserRole } from "@lib/userRole";
import {
  OutlinedCalendarAltIcon,
  UserIcon,
  AddCircleOIcon,
  UsersIcon,
} from "@patternfly/react-icons";
import NavButton from "./NavButton";
import { Stylesheet, CSS } from "@lib/utils";

const styles: Stylesheet = {
  linkContainer: {
    textAlign: "center",
    display: "flex",
    // justifyContent: "space-around",
    alignItems: "center",
    bottom: 0,
    width: "100%",
    zIndex: 1,
    flexShrink: 0,
    marginBottom: "0.5rem",
  },
  linkItemContainer: {
    display: "flex",
    alignItems: "center",
    justifySelf: "flex-end",
    flexDirection: "column",
  },
  icon: {
    color: "black",
    fontSize: "1.5rem",
  },
};

interface NavbarLinksProps {
  user?: User;
}

export default function NavigationBar({ user }: NavbarLinksProps) {
  return (
    <div>
      {user && user.role === UserRole.CLIENT ? (
        <div style={styles.linkContainer}>
          <div style={styles.linkItemContainer}>
            <OutlinedCalendarAltIcon style={styles.icon} />
            <NavButton href="/user/appointments" label="View appointments" />
          </div>
          <div style={styles.linkItemContainer}>
            <NavButton href="/user/update" label="Update your info" />
          </div>
        </div>
      ) : null}
      {user && user.role === UserRole.PROFESSIONAL ? (
        <div style={styles.linkContainer}>
          <div style={styles.linkItemContainer}>
            <OutlinedCalendarAltIcon style={styles.icon} />
            <NavButton href="/staff/appointments" label="View appointments" />
          </div>
          <div style={styles.linkItemContainer}>
            <AddCircleOIcon style={styles.icon} />
            <NavButton
              href="/staff/appointment/new"
              label="Create appointment"
            />
          </div>
          <div style={styles.linkItemContainer}>
            <NavButton
              href="/staff/manage/appointments"
              label="Manage appointments"
            />
          </div>
          <div style={styles.linkItemContainer}>
            <UsersIcon style={styles.icon} />
            <NavButton href="/registration" label="Invite new client" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
