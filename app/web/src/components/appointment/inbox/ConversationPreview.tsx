"use client";

import { UserRole } from "@lib/userRole";
import { Panel } from "@patternfly/react-core";
import Image from "next/image";

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
    <Panel>
      <Image
        src={contactAvatarUrl}
        alt={`Avatar for ${contactName}`}
        width={50}
        height={50}
      />
      <div>
        <time>{appointmentDate}</time>
        <span>
          <h2>{contactName}</h2>
          <span>{contactRole}</span>
        </span>
      </div>
    </Panel>
  );
};
