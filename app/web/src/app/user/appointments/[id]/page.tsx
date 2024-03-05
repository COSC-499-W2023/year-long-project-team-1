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
  getAppointment,
  getLoggedInUser,
  getOtherAppointmentUser,
} from "@app/actions";
import { AppointmentTimeline } from "@components/appointment/timeline/AppointmentTimeline";
import { Appointment } from "@prisma/client";

export default async function UserAppointmentsPage({
  params,
}: {
  params: { id: string };
}) {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    return <main>User not logged in.</main>;
  }

  const apptId = parseInt(params.id);

  if (!apptId) {
    return <main>Appointment not found.</main>;
  }

  let otherUser;
  try {
    otherUser = await getOtherAppointmentUser(apptId, loggedInUser);
  } catch (err: any) {
    console.error("Error getting other user for appointment", err);
    return <main>Appointment not found.</main>;
  }

  const appt = await getAppointment(apptId);

  if (!appt) {
    return <main>Appointment not found.</main>;
  }

  return (
    <main>
      <AppointmentTimeline
        appointment={appt}
        user={loggedInUser}
        contact={otherUser}
      />
    </main>
  );
}
