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
import { ExampleUserCard } from "@components/user/ExampleUserCard";
import { getSession, getUserFromCookies } from "@lib/session";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";
import { auth } from "src/auth";

// export const dynamic = "force-dynamic";

export default async function UserPage() {
  return (
    <main>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <LinkButton href="/user/dashboard" label="Go to dashboard" />
        <LinkButton href="/user/update" label="Update your info" />
        <LinkButton href="/user/appointments" label="Check your appointments" />
        <br />
        <LinkButton href="/upload" label="Upload a video" />
      </div>
    </main>
  );
}
