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

import { clearAuthSession, logOut } from "@app/actions";
import { clearSession } from "@lib/session";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authManager } from "src/auth";
import { signOut } from "next-auth/react";

export default function LogoutHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    // const logout = async () => {
    //   if (authManager === "basic") {
    //     // const redirectTo = searchParams.get("r");
    //     // await signOut({ callbackUrl: redirectTo ?? "/", redirect: true });
    //     await signOut();
    //     setLoggedOut(true);
    //     return;
    //   }

    //   const loggedOut = await clearAuthSession();
    //   setLoggedOut(loggedOut);
    // };
    // logout();

    if (authManager === "basic") {
      signOut({ callbackUrl: "/", redirect: true });
      // setLoggedOut(true);
    }
  }, []);

  useEffect(() => {
    // const redirectTo = searchParams.get("r");
    // const redirectUrl =
    //   "/login" + (redirectTo ? "?r=" + encodeURIComponent(redirectTo) : "");
    // const redirectUrl = "/";
    // router.push(redirectUrl);
  }, [loggedOut]);

  return <main>Logging out...</main>;
}
