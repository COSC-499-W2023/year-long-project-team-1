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

import { getAppointmentMetadata, getLoggedInUser } from "@app/actions";
import { Metadata } from "next";
import { AppointmentInbox } from "@components/appointment/inbox/AppointmentInbox";
import Content from "@components/layout/Content";

export const metadata: Metadata = {
  title: "Appointments",
};

export default async function StaffAppointmentPage() {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    return <Content>User not logged in.</Content>;
  }

  const appointmentsMetadata = await getAppointmentMetadata(loggedInUser);

  return (
    <AppointmentInbox user={loggedInUser} apptMetadata={appointmentsMetadata} />
  );
}
