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

import LinkButton from "@components/form/LinkButton";
import Content from "@components/layout/Content";
import { CSS } from "@lib/utils";
import React from "react";

const buttonsStyles: CSS = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  justifyContent: "flex-start",
  alignItems: "center",
  padding: "1rem",
};

export default async function UserPage() {
  return (
    <Content>
      <div style={buttonsStyles} className="user-page">
        <LinkButton href="/user/appointments" label="Appointments" />
        <LinkButton href="/user/update" label="Update your info" />
      </div>
    </Content>
  );
}
