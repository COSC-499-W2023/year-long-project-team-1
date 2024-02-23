"use client";

import { UserRole } from "@lib/userRole";
import { CSS } from "@lib/utils";
import {
  Panel,
  PanelFooter,
  PanelHeader,
  PanelMain,
  Title,
} from "@patternfly/react-core";
import { ConversationPreview } from "./ConversationPreview";
import pfAvatar from "@assets/pf_avatar.svg";
import { ConversationDropdownMenu } from "./ConversationDropdownMenu";
import { User } from "next-auth";
import Image from "next/image";
import { InboxAvatar } from "./InboxAvatar";
import Link from "next/link";

const panelStyle: CSS = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  height: "75vh",
  flexBasis: `${100 / 3}%`,
  borderRight: "1px solid grey",
};

const headerStyle: CSS = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  height: "4rem",
  width: "100%",
  borderBottom: "1px solid grey",
};

const titleStyle: CSS = {
  fontSize: "1.5rem",
  fontWeight: "700",
  textTransform: "uppercase",
};

const listStyle: CSS = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  flexGrow: "1",
  overflowY: "auto",
  width: "100%",
};

const footerStyle: CSS = {
  ...headerStyle,
  borderTop: "1px solid grey",
  borderBottom: "none",
  paddingTop: "2.5rem",
  paddingBottom: "2.5rem",
};

const userInfoStyle: CSS = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "0.25rem",
  flexGrow: "1",
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

const profileLinkStyle: CSS = {
  fontSize: "0.75rem",
};

interface ConversationListProps {
  user: User;
}

export const ConversationList = ({ user }: ConversationListProps) => {
  const handleApptClick = (appointmentId: string) => {
    console.log(`Clicked appointment: ${appointmentId}`);
  };

  // TODO: source data from API in Server Component parent
  const testConversationPreviewData = {
    appointmentDate: "2022-01-01",
    contactName: "John Doe",
    contactRole: UserRole.PROFESSIONAL,
    contactAvatarUrl: pfAvatar.src,
  };

  const conversationPreviews = Array.from({ length: 20 }).map((_, i) => {
    return (
      <ConversationPreview
        key={`preview-${i}`}
        appointmentDate={testConversationPreviewData.appointmentDate}
        contactName={testConversationPreviewData.contactName}
        contactRole={testConversationPreviewData.contactRole}
        contactAvatarUrl={testConversationPreviewData.contactAvatarUrl}
        appointmentId={`appointment-${i}`}
        onClick={handleApptClick}
      />
    );
  });

  return (
    <Panel style={panelStyle}>
      <PanelHeader style={headerStyle}>
        <Title headingLevel="h1" size="xl" style={titleStyle}>
          Appointments
        </Title>
        <ConversationDropdownMenu />
      </PanelHeader>
      <PanelMain style={listStyle}>{conversationPreviews}</PanelMain>
      <PanelFooter style={footerStyle}>
        <InboxAvatar avatarUrl={pfAvatar.src} />
        <div style={userInfoStyle}>
          <Title headingLevel="h2" style={userNameStyle}>
            {user.firstName + " " + user.lastName}
          </Title>
          <span style={userMetaStyle}>{user.email}</span>
        </div>
        {/* TODO: possibly remove this link (do users have profiles?) */}
        <Link href="#profile" style={profileLinkStyle}>
          View Profile
        </Link>
      </PanelFooter>
    </Panel>
  );
};
