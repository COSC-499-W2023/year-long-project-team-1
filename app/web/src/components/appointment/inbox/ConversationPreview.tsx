"use client";

import { UserRole } from "@lib/userRole";
import { Panel } from "@patternfly/react-core";
import Image from "next/image";
import { CSS } from "@lib/utils";

const panelStyle: CSS = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
};

const avatarStyle: CSS = {
  borderRadius: "100%",
};

const infoStyle: CSS = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  marginLeft: "1rem",
  flexGrow: "1",
};

const timeStyle: CSS = {
  fontSize: "0.75rem",
};

const contactStyle: CSS = {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-end",
  justifyContent: "flex-start",
  gap: "0.5rem",
  lineHeight: "1",
};

const nameStyle: CSS = {
  fontSize: "1.25rem",
  fontWeight: "700",
};

const roleStyle: CSS = {
  fontSize: "0.8rem",
  textTransform: "capitalize",
  fontStyle: "italic",
  fontWeight: "lighter",
  lineHeight: "1",
};

interface ConverstionPreviewProps {
  appointmentDate: string;
  contactName: string;
  contactRole: UserRole;
  contactAvatarUrl: string;
}

export const ConversationPreview = ({
  appointmentDate,
  contactName,
  contactRole,
  contactAvatarUrl,
}: ConverstionPreviewProps) => {
  return (
    <Panel style={panelStyle}>
      <Image
        style={avatarStyle}
        src={contactAvatarUrl}
        alt={`Avatar for ${contactName}`}
        width={50}
        height={50}
      />
      <div style={infoStyle}>
        <time style={timeStyle}>{appointmentDate}</time>
        <span style={contactStyle}>
          <h2 style={nameStyle}>{contactName}</h2>
          <span style={roleStyle}>{contactRole}</span>
        </span>
      </div>
    </Panel>
  );
};
