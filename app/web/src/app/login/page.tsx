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
import { PalLoginForm } from "@components/auth/LoginForm";
import { getUserHubSlug } from "@lib/utils";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { auth } from "src/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Login",
};

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect(getUserHubSlug(session.user));
  }

  return (
    <main>
      <Suspense>
        <PalLoginForm />
      </Suspense>
    </main>
  );
}
