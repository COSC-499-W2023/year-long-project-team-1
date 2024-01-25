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
import {
  findUserById,
  findUserSanitizedById,
  getLoggedInUser,
  getClientAppointment,
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
    const appt = await getClientAppointment(user, apptId);

    // if there is no appointment by that id, return 404
    if (!appt) return notFound();

    // display appointment data
    const professional = await findUserSanitizedById(appt.proId);

    if (!professional) notFound();

    const viewableAppointment: ViewableAppointment = {
      id: appt.id,
      clientUser: user,
      professionalUser: professional,
      time: appt.time,
    };

    return (
      <AppointmentViewer appointment={viewableAppointment} viewer={user} />
    );
  } catch (error: any) {
    // return 404 if there is an error
    // console.error(error);
    return notFound();
  }
}
