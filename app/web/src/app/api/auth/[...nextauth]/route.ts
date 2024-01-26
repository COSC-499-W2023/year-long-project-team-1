import NextAuth, { NextAuthOptions, getServerSession } from "next-auth";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next/types";
import { cognitoConfig, customAuthConfig } from "src/auth";

const authManager = process.env.PRIVACYPAL_AUTH_MANAGER || "basic";

function getAuthOptions(): NextAuthOptions{
  switch(authManager){
    case "cognito":
      return cognitoConfig;
    default:
      return customAuthConfig;
  }
}

export function auth(
  ...args:
        | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
        | [NextApiRequest, NextApiResponse]
        | []
){
  return getServerSession(...args, getAuthOptions())
}

const handler = NextAuth(getAuthOptions())

export { handler as GET, handler as POST }
