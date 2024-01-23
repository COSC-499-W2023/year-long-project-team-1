import NextAuth, { NextAuthOptions, Session, getServerSession } from "next-auth"
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import CognitoProvider from "next-auth/providers/cognito";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next/types";

const clientId = process.env.AWS_CLIENT || "";
const clientSecret = process.env.AWS_CLIENT_SECRET || "";
const userPoolId = process.env.AWS_POOL_ID || "";
const region = process.env.AWS_REGION || "";

export const authOptions : NextAuthOptions = {
    secret: "secret",
    providers: [
        CognitoProvider({
            clientId: clientId,
            clientSecret: clientSecret,
            issuer: new URL(userPoolId, `https://cognito-idp.${region}.amazonaws.com`).href,
            idToken: true,
        })
    ],
    session:{
      strategy: 'jwt',
    },
    callbacks: {
      // @ts-ignore
      jwt: async (token) => {
        // if (oAuthProfile) {
        //   console.log("JWT callback on sign in", token, oAuthProfile)
        // } else {
        //   console.log("JWT callback after sign in", token)
        // }
        return Promise.resolve(token)
      },
      session: async ({session, token}) => {
        // @ts-expect-error
        session.accessToken = token.token.account.access_token;
        return session;
      },
    }
}

export function auth(
  ...args:
        | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
        | [NextApiRequest, NextApiResponse]
        | []
){
  return getServerSession(...args, authOptions)
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
