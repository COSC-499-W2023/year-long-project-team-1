"use client";

import LinkButton from "@components/form/LinkButton";
import { ViewableAppointment } from "@lib/appointment";
import { Button, Card, CardBody } from "@patternfly/react-core";
import { Role, User } from "@prisma/client";
import db from "@lib/db";

interface AppointmentViewerProps {
  appointment: ViewableAppointment;
  viewer?: Omit<User, "password">;
}

export default function AppointmentViewer({
  appointment,
  viewer,
}: AppointmentViewerProps) {
  const proUser =
    appointment.professionalUser.firstname +
    " " +
    appointment.professionalUser.lastname;
  const clientUser =
    appointment.clientUser.firstname + " " + appointment.clientUser.lastname;

  const viewerRole = viewer?.role;

  const uploadButton =
    viewerRole === Role.CLIENT ? (
      <LinkButton href="/upload" label="Upload a video to this appointment" />
    ) : null;

  const cancelButton =
    viewerRole === Role.PROFESSIONAL ? (
      <Button
        onClick={() => {
          // cancel the appointment here
          db.appointment.delete({
            where: {
              id: {
                equals: appointment.id,
              },
            },
          });
        }}
        variant="danger"
      >
        Cancel appointment
      </Button>
    ) : null;

  const viewDetailsButton =
    viewerRole === Role.PROFESSIONAL ? (
      <LinkButton
        href={`/staff/appointment?id=${appointment.id}`}
        label="View appointment details"
      />
    ) : null;

  return (
    <Card>
      <CardBody>
        <h2>Appointment</h2>
        <time>{appointment.time.toLocaleDateString()}</time>
        <p>Professional: {proUser}</p>
        <p>Client: {clientUser}</p>
        {uploadButton}
        {cancelButton}
        {viewDetailsButton}
      </CardBody>
    </Card>
  );
}
