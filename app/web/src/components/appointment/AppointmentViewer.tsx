"use client";

import LinkButton from "@components/form/LinkButton";
import { ViewableAppointment } from "@lib/appointment";
import { Button, Card, CardBody } from "@patternfly/react-core";
import { Role, User } from "@prisma/client";

interface AppointmentViewerProps {
  appointment: ViewableAppointment;
  viewer?: Omit<User, "password">;
}

export default async function AppointmentViewer({
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

  const numVideosJSON = await (await fetch(`http://localhost:8081/api/video/count?id=${appointment.id}`, {
    method: "GET",
  })).json();
  const numVideos = numVideosJSON.data.count || 0;

  const uploadButton =
    viewerRole === Role.CLIENT ? (
      <LinkButton href="/upload" label="Upload a video to this appointment" />
    ) : null;

  const cancelButton =
    viewerRole === Role.PROFESSIONAL ? (
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
        <p>Number of associated videos: {numVideos}</p>
        {uploadButton}
        {cancelButton}
        {viewDetailsButton}
      </CardBody>
    </Card>
  );
}
