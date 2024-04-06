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
  OutlinedCommentsIcon,
} from "@patternfly/react-icons";
import NavButton from "./NavButton";
import { Stylesheet, CSS } from "@lib/utils";
import { Tooltip } from "@patternfly/react-core";

const styles: Stylesheet = {
  linkContainer: {
    textAlign: "center",
    display: "flex",
    // justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    zIndex: 1,
    flexShrink: 0,
  },
  linkItemContainer: {
    display: "flex",
    alignItems: "center",
    justifySelf: "flex-end",
    flexDirection: "column",
  },
  icon: {
    color: "black",
    fontSize: "2rem",
    marginLeft: "0.5rem",
    marginRight: "1.5rem",
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
            <Tooltip content="View appointments" position="bottom">
              <a href="/user/appointments">
                <OutlinedCommentsIcon style={styles.icon} />
              </a>
            </Tooltip>
            {/* <NavButton href="/user/appointments" label="View appointments" /> */}
          </div>
          <div style={styles.linkItemContainer}>
            <Tooltip content="Update your info" position="bottom">
              <a href="/user/update">
                <UserIcon style={styles.icon} />
              </a>
            </Tooltip>
            {/* <NavButton href="/user/update" label="Update your info" /> */}
          </div>
        </div>
      ) : null}
      {user && user.role === UserRole.PROFESSIONAL ? (
        <div style={styles.linkContainer}>
          <div style={styles.linkItemContainer}>
            <Tooltip content="View appointments" position="bottom">
              <a href="/staff/appointments">
                <OutlinedCommentsIcon style={styles.icon} />
              </a>
            </Tooltip>
            {/* <NavButton href="/staff/appointments" label="View appointments" /> */}
          </div>
          <div style={styles.linkItemContainer}>
            <Tooltip content="Create appointment" position="bottom">
              <a href="/staff/appointment/new">
                <AddCircleOIcon style={styles.icon} />
              </a>
            </Tooltip>
            {/* <NavButton
              href="/staff/appointment/new"
              label="Create appointment"
            /> */}
          </div>
          <div style={styles.linkItemContainer}>
            <Tooltip content="Manage appointments" position="bottom">
              <a href="/staff/manage/appointments">
                <OutlinedCalendarAltIcon style={styles.icon} />
              </a>
            </Tooltip>
            {/* <NavButton
              href="/staff/manage/appointments"
              label="Manage appointments"
            /> */}
          </div>
          <div style={styles.linkItemContainer}>
            <Tooltip content="Invite new client" position="bottom">
              <a href="/registration">
                <UsersIcon style={styles.icon} />
              </a>
            </Tooltip>
            {/* <NavButton href="/registration" label="Invite new client" /> */}
          </div>
          {/* <div style={styles.linkItemContainer}>
            <a href="/staff/update">
              <UserIcon style={styles.icon} />
            </a>
            <NavButton href="/staff/update" label="Update your info" />
          </div> */}
        </div>
      ) : null}
    </div>
  );
}
