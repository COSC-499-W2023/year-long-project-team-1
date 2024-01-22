import {
  findUserById,
  findUserSanitizedById,
  getLoggedInUser,
  getProfessionalAppointment,
} from "@app/actions";
import AppointmentViewer from "@components/appointment/AppointmentViewer";
import { ViewableAppointment } from "@lib/appointment";
import { NextPageProps } from "@lib/url";
import { notFound, redirect } from "next/navigation";

export default async function AppointmentPage({ searchParams }: NextPageProps) {
  // if no appointment id, redirect to staff dashboard
  if (!searchParams?.id || Array.isArray(searchParams?.id)) {
    return redirect("/staff/");
  }

  try {
    // parseInt will throw an error if the id is not a number-string
    const apptId = parseInt(searchParams?.id);
    const user = await getLoggedInUser();

    // if somehow there is no user, redirect to login
    if (!user) redirect("/login");

    // this function will throw an error if the logged in user is not a professional
    const appt = await getProfessionalAppointment(user, apptId);

    // if there is no appointment by that id, return 404
    if (!appt) return notFound();

    // display appointment data
    const client = await findUserSanitizedById(appt.clientId);

    if (!client) notFound();

    const viewableAppointment: ViewableAppointment = {
      id: appt.id,
      clientUser: client,
      professionalUser: user,
      time: appt.time,
    };

    return (
      <AppointmentViewer appointment={viewableAppointment} viewer={user} />
    );
  } catch (error: any) {
    // return 404 if there is an error
    return notFound();
  }
}
