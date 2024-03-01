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

import { LoginBypass } from "@components/auth/LoginBypass";
import LoginFlow from "@components/auth/LoginFlow";
import { LoginLogout } from "@components/auth/button/LoginLogout";
import React, { Suspense } from "react";
import { authManager } from "src/auth";

export const dynamic = "force-dynamic";

const LoginFallback = () => {
  return <h1>Loading...</h1>;
};

export default function LoginPage() {
  return (
    <main>
      {/* <Suspense fallback={<LoginFallback />}>
        <LoginFlow />
      </Suspense> */}
      {/* <LoginLogout /> */}
      <LoginBypass authManager={authManager} />
    </main>
  );
}
