import { StringAttributeConstraintsType } from "@aws-sdk/client-cognito-identity-provider";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      username: string;
      firstName: string;
      lastName: string;
      phone_number: string;
      email: string;
    };
  }
}
