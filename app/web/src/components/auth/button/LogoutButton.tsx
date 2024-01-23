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

"use client";

import { logOut } from "@app/actions";
import { signOutFromCognito } from "@lib/cognito";
import { Button } from "@patternfly/react-core";
import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  redirectTo?: string;
  onSignOut: Promise<void>;
}

export const LogoutButton = ({ redirectTo, onSignOut}: LogoutButtonProps) => {
  // const handleLogout = async () => {
  //   await logOut(redirectTo ?? "/");
  // };

  // return (
  //   <Button variant="danger" onClick={handleLogout}>
  //     Log out
  //   </Button>
  // );

  return <button onClick={()=>signOut({callbackUrl:"/api/auth/logout"})}>Sign out</button>;
};
