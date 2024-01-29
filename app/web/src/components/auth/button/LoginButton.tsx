"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { authManager } from "src/auth";

export const LoginButton = () => {
  switch (authManager) {
    case "cognito":
      return <button onClick={() => signIn(authManager)}>Sign in</button>;
    case "basic":
    default:
      return <Link href="/login">Sign in</Link>;
  }
};
