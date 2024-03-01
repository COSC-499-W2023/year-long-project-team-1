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

import { LoginLogout } from "@components/auth/button/LoginLogout";
import LinkButton from "@components/form/LinkButton";
import Content from "@components/layout/Content";
import React from "react";

export default async function UserPage() {
  return (
    <Content>
      <LinkButton href="/user/dashboard" label="Go to dashboard" />
      <LinkButton href="/user/update" label="Update your info" />
      <LinkButton href="/user/appointments" label="Check your appointments" />
      <br />
      <LinkButton href="/upload" label="Upload a video" />
    </Content>
  );
}
