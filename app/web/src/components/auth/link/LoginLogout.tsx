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

interface LoginLogoutProps {
  user?: PrivacyPalAuthUser;
  className?: string;
  style?: React.CSSProperties;
}

export const LoginLogout = async ({ className, style }: LoginLogoutProps) => {
  const user = await getAuthSession();

  if (!user) {
    return (
      <>
        <Link
          href="/login"
          prefetch={false}
          style={style}
          className={className}
        >
          Log in
        </Link>
        <Link
          href="/signup"
          prefetch={false}
          style={style}
          className={className}
        >
          Sign Up
        </Link>
      </>
    );
  }

  return (
    <Link href="/logout" style={style} className={className}>
      Log out
    </Link>
  );
};
