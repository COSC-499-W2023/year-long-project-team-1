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
  justifyContent: "flex-start",
  height: "4rem",
  width: "100%",
  borderBottom: "1px solid grey",
  padding: "1rem",
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
  padding: "1rem",
  flexGrow: "1",
  overflowY: "auto",
  gap: "1rem",
  width: "100%",
};

const footerStyle: CSS = {
  ...headerStyle,
  borderTop: "1px solid grey",
  borderBottom: "none",
};

const testConversationPreviewData = {
  appointmentDate: "2022-01-01",
  contactName: "John Doe",
  contactRole: UserRole.PROFESSIONAL,
  contactAvatarUrl: pfAvatar.src,
};

export const ConversationList = () => {
  const conversationPreviews = Array.from({ length: 20 }).map((_, i) => {
    return (
      <ConversationPreview
        key={`preview-${i}`}
        appointmentDate={testConversationPreviewData.appointmentDate}
        contactName={testConversationPreviewData.contactName}
        contactRole={testConversationPreviewData.contactRole}
        contactAvatarUrl={testConversationPreviewData.contactAvatarUrl}
      />
    );
  });

  return (
    <Panel style={panelStyle}>
      <PanelHeader style={headerStyle}>
        <Title headingLevel="h1" size="xl" style={titleStyle}>
          Appointments
        </Title>
      </PanelHeader>
      <PanelMain style={listStyle}>{conversationPreviews}</PanelMain>
      <PanelFooter style={footerStyle}>Footer</PanelFooter>
    </Panel>
  );
};
