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

import LinkButton from "@components/form/LinkButton";
import { ViewableAppointment } from "@lib/appointment";
import { UserRole } from "@lib/userRole";
import { Button, Card, CardBody } from "@patternfly/react-core";
import { User } from "next-auth";

interface AppointmentViewerProps {
  appointment: ViewableAppointment;
  viewer?: User;
}

export default function AppointmentViewer({
  appointment,
  viewer,
}: AppointmentViewerProps) {
  const proUser =
    appointment.professionalUser.firstName +
    " " +
    appointment.professionalUser.lastName;
  const clientUser =
    appointment.clientUser.firstName + " " + appointment.clientUser.lastName;

  const viewerRole = viewer?.role;

  const uploadButton =
    viewerRole === UserRole.CLIENT ? (
      <LinkButton
        href={`/upload/${appointment.id}`}
        label="Upload a video to this appointment"
      />
    ) : null;

  const cancelButton =
    viewerRole === UserRole.PROFESSIONAL ? (
      <Button
        onClick={async () => {
          // make a DELETE request to the appointments api to delete the appointment
          const response = await fetch(
            `/api/appointments?id=${appointment.id}`,
            {
              method: "DELETE",
            },
          );
          if (response.status == 200) {
            alert("Successfully deleted appointment.");
          } else {
            alert("An error occurred while deleting appointment.");
          }
        }}
        variant="danger"
      >
        Cancel appointment
      </Button>
    ) : null;

  const viewDetailsButton =
    viewerRole === UserRole.PROFESSIONAL ? (
      <LinkButton
        href={`/staff/appointment?id=${appointment.id}`}
        label="View appointment details"
      />
    ) : null;

  return (
    <Card>
      <CardBody>
        <h2>Appointment</h2>
        <time>{appointment.time.toLocaleString("en-US")}</time>
        <p>Professional: {proUser}</p>
        <p>Client: {clientUser}</p>
        <p>Number of associated videos: {appointment.video_count}</p>
        {uploadButton}
        {cancelButton}
        {viewDetailsButton}
      </CardBody>
    </Card>
  );
}
