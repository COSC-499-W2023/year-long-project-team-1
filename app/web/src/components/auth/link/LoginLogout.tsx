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
import { getAuthSession } from "@app/actions";
import { PrivacyPalAuthUser } from "@lib/auth";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react"
import { getServerSession } from "next-auth/next";
import { LogoutButton } from "../button/LogoutButton";
import { LoginButton } from "../button/LoginButton";
import { auth } from "@app/api/auth/[...nextauth]/route";
import { signOutFromCognito } from "@lib/cognito";

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
  // const user = await getAuthSession();
  // if (!user) {
  //   return (
  //     <>
  //       <Link
  //         href="https://authentication.auth.ca-central-1.amazoncognito.com/oauth2/authorize?client_id=4ehadggq3m9sd1gj6g98h9geb0&response_type=code&scope=email+openid+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fauthorize"
  //         prefetch={false}
  //         style={style}
  //         className={className}
  //       >
  //         Log in
  //       </Link>
  //       <Link
  //         href="/signup"
  //         prefetch={false}
  //         style={style}
  //         className={className}
  //       >
  //         Sign Up
  //       </Link>
  //     </>
  //   );
  // }

  // return (
  //   <Link href="/logout" style={style} className={className}>
  //     Log out
  //   </Link>
  // );

  const session = await auth();
  if (session?.user){
    return <LogoutButton onSignOut={onSignOut(session?.accessToken)}/>
  }
  return <LoginButton/>
};
