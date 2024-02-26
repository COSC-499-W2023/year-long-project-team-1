"use client";

import { Panel, PanelHeader, PanelMain, Title } from "@patternfly/react-core";
import { InboxAvatar } from "./InboxAvatar";
import pfAvatar from "@assets/pf_avatar.svg";
import { CSS } from "@lib/utils";
import { User } from "next-auth";
import Link from "next/link";

const panelStyle: CSS = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  height: "75vh",
  flexBasis: `${200 / 3}%`,
};

const headerStyle: CSS = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  height: "4rem",
  width: "100%",
  borderBottom: "1px solid grey",
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
  padding: `4rem ${100 / 6}%`,
};

interface ConversationViewerProps {
  withUser: User;
  children?: React.ReactNode;
}

export const ConversationViewer = ({
  withUser,
  children,
}: ConversationViewerProps) => {
  return (
    <Panel style={panelStyle}>
      <PanelHeader style={headerStyle}>
        <InboxAvatar avatarUrl={pfAvatar.src} />
        <div style={userInfoStyle}>
          <Title headingLevel="h2" style={userNameStyle}>
            {withUser.firstName + " " + withUser.lastName}
          </Title>
          <span style={userMetaStyle}>{withUser.email}</span>
        </div>
      </PanelHeader>
      <PanelMain style={panelBodyStyle}>{children}</PanelMain>
    </Panel>
  );
};
