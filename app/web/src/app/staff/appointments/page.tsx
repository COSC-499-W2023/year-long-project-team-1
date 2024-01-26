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
  getLoggedInUser,
  getAppointmentsProfessional,
  findUserSanitizedById,
  getVideoCount,
} from "@app/actions";
import AppointmentViewer from "@components/appointment/AppointmentViewer";
import { notFound, redirect } from "next/navigation";
import { ViewableAppointment } from "@lib/appointment";

export default async function ViewAppointmentDetailsForm() {
  const user = await getLoggedInUser();
  if (!user) redirect("/login");

  // get appointments
  const appointments: React.JSX.Element[] = [];
  (await getAppointmentsProfessional(user)).forEach(async (i) => {
    const client = await findUserSanitizedById(i.clientId);
    if (!client) notFound();
    const appt: ViewableAppointment = {
      id: i.id,
      clientUser: client,
      professionalUser: user,
      time: i.time,
      video_count: await getVideoCount(i.id),
    };
    console.log(appt); // can see all the correct data showing up here
    appointments.push(<AppointmentViewer appointment={appt} viewer={user} />);
  });

  return <main>{appointments}</main>;
}
