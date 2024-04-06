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
import { Panel, PanelHeader, PanelMain, Title } from "@patternfly/react-core";
import { InboxAvatar } from "./InboxAvatar";
import pfAvatar from "@assets/pf_avatar.svg";
import { CSS } from "@lib/utils";
import { User } from "next-auth";
import { CognitoUser } from "@lib/cognito";
import Link from "next/link";

const panelStyle: CSS = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  height: "var(--pal-main-height)",
  // flexBasis: `${200 / 3}%`,
  flexGrow: "1",
};

const headerStyle: CSS = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  height: "4rem",
  width: "100%",
  borderBottom: "1px solid #ccc",
  gap: "1rem",
};

const titleStyle: CSS = {
  fontSize: "1.5rem",
  fontWeight: "700",
  textTransform: "uppercase",
};

const userInfoStyle: CSS = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  gap: "0.25rem",
  flexGrow: "0",
};

const userNameStyle: CSS = {
  fontSize: "1.25rem",
  fontWeight: "700",
  lineHeight: "1",
};

const userMetaStyle: CSS = {
  fontSize: "0.75rem",
  lineHeight: "1",
  fontStyle: "italic",
  fontWeight: "lighter",
};

const panelBodyStyle: CSS = {
  background: "linear-gradient(to bottom, #fff 0%, #fff 25%, #c4dcf3 100%)",
  width: "100%",
  height: "100%",
  padding: `4rem 0`,
  overflow: "auto",
};

const panelBodyDescendants: CSS = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  gap: "2rem",
  width: "50rem",
  maxWidth: "90%",
  margin: "0 auto",
};

interface ConversationViewerProps {
  withUser: CognitoUser | undefined;
  children?: React.ReactNode;
}
export const ConversationViewer = ({
  withUser,
  children,
}: ConversationViewerProps) => {
  const headerText = withUser
    ? withUser.firstName + " " + withUser.lastName
    : "No appointment selected.";
  const profilepage = `/profile/${withUser?.username}`;
  const avatarLink = withUser
    ? `https://ui-avatars.com/api/?background=random&name=${withUser.firstName}+${withUser.lastName}`
    : pfAvatar.src;
  return (
    <Panel style={panelStyle}>
      <PanelHeader style={headerStyle}>
        <InboxAvatar avatarUrl={avatarLink} />
        <div style={userInfoStyle}>
          <Title headingLevel="h2" style={userNameStyle}>
            {headerText}
          </Title>
          {withUser ? (
            <span style={userMetaStyle}>{withUser.email}</span>
          ) : null}
        </div>
        {withUser && <Link href={profilepage}>View profile</Link>}
      </PanelHeader>
      <PanelMain style={panelBodyStyle}>
        <div style={panelBodyDescendants}>{children}</div>
      </PanelMain>
    </Panel>
  );
};
