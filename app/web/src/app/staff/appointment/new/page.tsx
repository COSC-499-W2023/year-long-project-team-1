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
import NewAppointmentForm from "@components/staff/NewAppointmentForm";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export default async function NewAppointmentPage() {
  const professional = await getLoggedInUser();

  if (!professional) redirect("/login");

  const sessionPro: Session["user"] = {
    email: professional.email!,
    username: professional.username!,
    role: professional.role!,
    firstName: professional.firstname!,
    lastName: professional.lastname!,
    phone_number: "",
  };

  return (
    <main>
      <NewAppointmentForm professionalUser={sessionPro} />
    </main>
  );
}
