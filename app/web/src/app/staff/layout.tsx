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

import { getLoggedInUser } from "@app/actions";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const user = await getLoggedInUser();

  return {
    title: {
      template: `%s | ${user?.username} | PrivacyPal`,
      default: `Staff Area | ${user?.username}`,
    },
  };
}

interface StaffAreaLayoutProps {
  children?: React.ReactNode;
}

export default async function StaffAreaLayout({
  children,
}: StaffAreaLayoutProps) {
  return <>{children}</>; // if this line is removed, the staff appointment inbox at /staff/appointments will be squished to the center of the screen
  // return <Content aria-label="Staff-only page">{children}</Content>;
}
