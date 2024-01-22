import { getLoggedInUser, getProfessionalAppointment } from "@app/actions";
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
    return <div>{JSON.stringify(appt)}</div>;
  } catch (error: any) {
    // return 404 if there is an error
    return notFound();
  }
}
