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

import Loading from "@app/loading";
import { User } from "next-auth";
import { signIn } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LoginBypassProps {
  user: User | null;
  authManager: string;
}

export const LoginBypass = ({ user, authManager }: LoginBypassProps) => {
  const router = useRouter();

  useEffect(() => {
    // if user is already signed in, redirect to home page
    if (user) {
      router.push("/");
      return;
    }
    // attempt to sign in
    signIn(authManager);
  }, []);

  return <Loading />;
};
