"use client";

import LinkButton from "@components/form/LinkButton";
import { ViewableAppointment } from "@lib/appointment";
import { Button, Card, CardBody } from "@patternfly/react-core";
import { Role, User } from "@prisma/client";

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

  return (
    <Card>
      <CardBody>
        <h2>Appointment</h2>
        <time>{appointment.time.toLocaleDateString()}</time>
        <p>Professional: {proUser}</p>
        <p>Client: {clientUser}</p>
        {uploadButton}
      </CardBody>
    </Card>
  );
}
