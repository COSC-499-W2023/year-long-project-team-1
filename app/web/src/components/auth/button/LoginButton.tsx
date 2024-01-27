"use client"

import { signIn } from "next-auth/react"
import { authManager } from "src/auth"

export const LoginButton = () => {
    return <button onClick={() => signIn(authManager)}>Sign in</button>
}
