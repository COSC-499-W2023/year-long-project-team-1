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
import UserDashboard from "@components/user/UserDashboard";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export default async function UserDashboardPage() {
  const user = await getLoggedInUser();

  if (!user) {
    redirect("/login");
  }

  const sessionUser: Session["user"] = {
    email: user.email!,
    username: user.username!,
    role: user.role!,
    firstName: user.firstname!,
    lastName: user.lastname!,
    phone_number: "",
  };

  return (
    <main>
      <UserDashboard user={sessionUser} />
    </main>
  );
}
