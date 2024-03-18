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
import Content from "@components/layout/Content";
import { ProfileDetails } from "@components/profile/ProfileDetails";
import { auth } from "src/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Detail",
};

export default async function UserDashboardPage() {
  const session = await auth();

  if (!session) {
    return <main>Not logged in</main>;
  }

  return (
    <Content>
      <ProfileDetails user={session.user} />
    </Content>
  );
}
