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
import { LoginLogout } from "@components/auth/link/LoginLogout";
import React from "react";
import style from "@assets/style";

const HomePageContent = () => {
  "use client";

  return (
    <>
      <h2>Welcome to PrivacyPal</h2>
      <LoginLogout />
      <Link href="/staff">Staff Area</Link>
      <Link href="/user">User Area</Link>
    </>
  );
};

export default async function Home() {
  return (
    <main style={style.column}>
      <HomePageContent />
    </main>
  );
}
