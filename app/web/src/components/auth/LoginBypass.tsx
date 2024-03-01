"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";

interface LoginBypassProps {
  authManager: string;
}

export const LoginBypass = ({ authManager }: LoginBypassProps) => {
  useEffect(() => {
    // attempt to sign in immediately
    signIn(authManager);
  }, []);

  return <p>Redirecting...</p>;
};
