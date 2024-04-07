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
import { InboxAvatar } from "./InboxAvatar";
import Link from "next/link";
import { AppointmentMetadata } from "@app/actions";
import { AddCircleOIcon } from "@patternfly/react-icons";

const panelStyle: CSS = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  height: "var(--pal-main-height)",
  width: `${100 / 3}%`,
  maxWidth: "30rem",
  minWidth: "20rem",
  borderRight: "1px solid #ccc",
};

const headerStyle: CSS = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  height: "4rem",
  width: "100%",
  borderBottom: "1px solid #ccc",
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
  display: "flex",
  width: "100%",
  justifyContent: "center",
  borderTop: "1px solid #ccc",
  borderBottom: "none",
  paddingTop: "2rem",
  paddingBottom: "2rem",
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
  fontSize: "1rem",
};

interface ConversationListProps {
  user: User;
  apptMetadata: AppointmentMetadata[];
  onChooseAppointment: (appointmentId: number) => void;
}

export const ConversationList = ({
  user,
  apptMetadata,
  onChooseAppointment,
}: ConversationListProps) => {
  const handleApptClick = (appointmentId: number) => {
    onChooseAppointment(appointmentId);
  };

  // TODO: source data from API in Server Component parent
  const testConversationPreviewData = {
    appointmentDate: "2022-01-01",
    contactName: "John Doe",
    contactRole: UserRole.PROFESSIONAL,
    contactAvatarUrl: pfAvatar.src,
  };

  const conversationPreviews = apptMetadata.map(
    (meta: AppointmentMetadata, i) => {
      const contactName =
        meta.contact?.firstName + " " + meta.contact?.lastName;

      const contactRole =
        user.role === UserRole.PROFESSIONAL
          ? UserRole.CLIENT
          : UserRole.PROFESSIONAL;
      const avatarLink = meta.contact
        ? `https://ui-avatars.com/api/?background=random&name=${meta.contact.firstName}+${meta.contact.lastName}`
        : pfAvatar.src;
      return (
        <ConversationPreview
          key={`preview-${i}`}
          appointmentDate={new Date(meta.apptDate).toLocaleString()}
          contactName={contactName}
          contactRole={contactRole}
          contactAvatarUrl={avatarLink}
          appointmentId={meta.apptId}
          onClick={handleApptClick}
        />
      );
    },
  );

  return (
    <Panel style={panelStyle}>
      <PanelHeader style={headerStyle}>
        <Title headingLevel="h1" size="xl" style={titleStyle}>
          Appointments
        </Title>
        <ConversationDropdownMenu />
      </PanelHeader>
      <PanelMain style={listStyle}>{conversationPreviews}</PanelMain>
      {user.role == "professional" ? (
        <PanelFooter style={footerStyle}>
          <Link href={"/staff/appointments/new"}>
            <AddCircleOIcon /> {"Create new appointment"}
          </Link>
        </PanelFooter>
      ) : null}
    </Panel>
  );
};
