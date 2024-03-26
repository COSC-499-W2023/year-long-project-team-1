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
import { VerificationForm } from "@components/registration/VerificationForm";
import { getSession } from "@lib/session";
import { redirect } from "next/navigation";

export default async function VerificationPage({
  params,
}: {
  params: { username: string };
}) {
  const session = await getSession();
  // if user is alrd verified, redirect to homepage
  if (session) {
    redirect("/");
  }
  return (
    <Content>
      <VerificationForm username={params.username} />
    </Content>
  );
}
