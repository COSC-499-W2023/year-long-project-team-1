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

import { AppointmentMetadata, getAppointment } from "@app/actions";
import { UploadWizard } from "@components/upload/UploadWizard";
import { UserRole } from "@lib/userRole";
import { CSS } from "@lib/utils";
import { Appointment } from "@prisma/client";
import { User } from "next-auth";
import { useEffect, useState } from "react";
import { AppointmentTimeline } from "../timeline/AppointmentTimeline";
import { ConversationList } from "./ConversationList";
import { ConversationViewer } from "./ConversationViewer";
import { redirect } from "next/navigation";

const inboxStyle: CSS = {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  width: "100%",
  height: "var(--pal-main-height)",
};

interface AppointmentInboxProps {
  user?: User;
  apptMetadata: AppointmentMetadata[];
}

export const AppointmentInbox = ({
  user,
  apptMetadata,
}: AppointmentInboxProps) => {
  const [currentApptId, setCurrentApptId] = useState<number | null>(null);
  const [currentAppointment, setCurrentAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    const fetchAppointment = async (apptId: number) => {
      const appointment = await getAppointment(apptId);
      setCurrentAppointment(appointment);
    };
    if (currentApptId !== null) {
      fetchAppointment(currentApptId);
    }
  }, [currentApptId]);

  const contact = apptMetadata.find(
    (appt) => appt.apptId === currentApptId,
  )?.contact;

  if (!user) {
    redirect("/login");
  }

  return (
    <div style={inboxStyle}>
      <ConversationList
        user={user}
        apptMetadata={apptMetadata}
        onChooseAppointment={setCurrentApptId}
      />
      <ConversationViewer withUser={contact}>
        {currentAppointment && contact && currentApptId ? (
          <>
            {user.role === UserRole.CLIENT ? (
              <UploadWizard apptId={currentApptId} onFinish={() => null} />
            ) : null}
            <AppointmentTimeline
              user={user}
              contact={contact}
              appointment={currentAppointment}
            />
          </>
        ) : null}
      </ConversationViewer>
    </div>
  );
};
