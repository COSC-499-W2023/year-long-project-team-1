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

import { getLoggedInUser } from "@app/actions";
import Link from "next/link";
import { auth } from "src/auth";

const style = {
  headerBar: {
    width: "100%",
    padding: "0.5rem var(--w--1-24)",
    display: "flex",
    justifyContent: "flex-end",
    backgroundColor: "var(--pf-v5-global--primary-color--100)",
  },
  link: {
    color: "white",
    textDecoration: "underline",
  },
};

interface UserLayoutProps {
  children?: React.ReactNode;
}

export default async function UserLayout({ children }: UserLayoutProps) {
  const session = await auth();

  if (!session) {
    return <main>Not logged in</main>;
  }

  return <main>{children}</main>;
}
