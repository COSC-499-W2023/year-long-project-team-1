"use client";

import { signIn } from "next-auth/react";

interface LoginLinkProps {
  authManager: string;
}

export const LoginLink = ({ authManager }: LoginLinkProps) => {
  return (
    <a href="#signin" onClick={() => signIn(authManager)}>
      Sign in
    </a>
  );
};
