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
import React from "react";
import style from "@assets/style";
import PrivacyPalLogo from "@components/layout/PrivacyPalLogo";
import { getLoggedInUser } from "./actions";
import { redirect } from "next/navigation";
import { getUserHubSlug } from "@lib/utils";
import LinkButton from "@components/form/LinkButton";

export default async function HomePage() {
  const user = await getLoggedInUser();

  if (user) {
    redirect(getUserHubSlug(user));
  }

  return (
    <main style={style.column}>
      <PrivacyPalLogo />
      <h1 style={style.texth1}>PRIVACYPAL</h1>
      <h2 style={style.texth2}>
        A SOLUTION TO ABSOLUTE{" "}
        <span style={{ color: "#F58658" }}>PRIVACY.</span>
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          marginTop: "1rem",
        }}
      >
        <LinkButton href="/staff" label="Staff Area" />
        <LinkButton href="/user" label="User Area" />
      </div>
    </main>
  );
}
