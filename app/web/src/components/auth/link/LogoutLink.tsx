"use client";

import { signOut } from "next-auth/react";

export const LogoutLink = () => {
  return (
    <a href="#signout" onClick={() => signOut({ callbackUrl: "/" })}>
      Sign out
    </a>
  );
};
