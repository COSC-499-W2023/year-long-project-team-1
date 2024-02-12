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

import { getLoggedInUser } from "@app/actions";
import { redirect } from "next/navigation";
import { User, Role } from "@prisma/client";
import AppointmentManagementList from "@components/appointment/AppointmentManagementList";

export default async function ViewAppointmentDetailsForm() {
  const user = await getLoggedInUser();
  if (user) user.role = user?.role.toUpperCase() || "";
  if (!user || user.role !== Role.PROFESSIONAL) redirect("/login");

  // cast our cognito user to a prisma user to search the database, id/password are not used so can be essentially null
  const prismaUser: User = {
    id: 0,
    username: user.username,
    password: "",
    email: user.email,
    firstname: user.firstName,
    lastname: user.lastName,
    role: user.role,
  };

  return (
    <main>
      <AppointmentManagementList professional={prismaUser} />
    </main>
  );
}
