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

import Link from "next/link";

import { TestUserList } from "@components/staff/TestUserList";
import LinkButton from "@components/form/LinkButton";
import { Metadata } from "next";

export default function StaffPage() {
  return (
    <>
      <TestUserList />
      <br />
      <LinkButton
        href="/staff/appointment/new"
        label="Create new appointment"
      />
      <LinkButton
        href="/staff/appointments"
        label="Manage existing appointments"
      />
      <LinkButton href="/registration" label="Invite new client" />
    </>
  );
}
