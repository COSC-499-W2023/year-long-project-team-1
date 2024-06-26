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

import { OtherUserProfileDetails } from "@components/profile/OtherUserProfileDetails";
import React from "react";
import { auth } from "src/auth";
import { Metadata } from "next";
import Content from "@components/layout/Content";

export const metadata: Metadata = {
  title: "Other User Profile Detail",
};

export default async function OtherUserProfilePage({
  params,
}: {
  params: { withUser: string };
}) {
  const session = await auth();
  if (!session) {
    return <Content>Not logged in</Content>;
  }
  return (
    <Content>
      <OtherUserProfileDetails withUser={params.withUser} user={session.user} />
    </Content>
  );
}
