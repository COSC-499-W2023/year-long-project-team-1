import { StringAttributeConstraintsType } from "@aws-sdk/client-cognito-identity-provider"
import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

interface Session {
  accessToken: string,
  user: {
    birthday: string,
    name: string,
    phone_number: string,
    email: string
  }
}
