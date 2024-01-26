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
import { PrivacyPalAuthUser } from "@lib/auth";
import { signOut } from "next-auth/react"
import { LogoutButton } from "../button/LogoutButton";
import { LoginButton } from "../button/LoginButton";
import { auth } from "@app/api/auth/[...nextauth]/route";
import { getUsrList } from "@lib/cognito";

interface LoginLogoutProps {
  user?: PrivacyPalAuthUser;
  className?: string;
  style?: React.CSSProperties;
}

const onSignOut = async (accessToken: string) => {
  // signOutFromCognito(accessToken);
  signOut();
}

export const LoginLogout = async ({ className, style }: LoginLogoutProps) => {

  const session = await auth();
  if (session?.user){
    const res = await getUsrList();
    return <LogoutButton/>
  }
  return <LoginButton/>
};
