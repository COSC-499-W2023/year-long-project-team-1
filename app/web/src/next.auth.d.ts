import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
//   interface User {
//     name: string
//   }

  interface Session {
    accessToken: string,
  }
}
