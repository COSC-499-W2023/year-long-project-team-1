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

import { UserRole } from "@lib/userRole";
import { Panel } from "@patternfly/react-core";
import Image from "next/image";
import { CSS } from "@lib/utils";
import { useState } from "react";
import { InboxAvatar } from "./InboxAvatar";

const panelStyle: CSS = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "1rem",
  width: "100%",
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
  appointmentId: number;
  onClick?: (appointmentId: number) => void;
}

export const ConversationPreview = ({
  appointmentDate,
  contactName,
  contactRole,
  contactAvatarUrl,
  appointmentId,
  onClick,
}: ConverstionPreviewProps) => {
  const [hovering, setHovering] = useState(false);

  const hoverStyle: CSS = {
    ...panelStyle,
    backgroundColor: hovering ? "lightgrey" : "white",
    cursor: "pointer",
  };

  const handleClick = () => {
    if (onClick) {
      onClick(appointmentId);
    }
  };

  return (
    <Panel
      style={hoverStyle}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={handleClick}
    >
      <InboxAvatar
        avatarUrl={contactAvatarUrl}
        alt={`Avatar for ${contactName} (${contactRole})`}
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
