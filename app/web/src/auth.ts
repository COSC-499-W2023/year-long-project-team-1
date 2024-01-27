import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions, getServerSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import CognitoProvider from "next-auth/providers/cognito";
import CredentialsProvider from 'next-auth/providers/credentials';

export const authManager = process.env.PRIVACYPAL_AUTH_MANAGER || "basic";

export const customAuthConfig : NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Basic Auth',
            id: 'basic',
            credentials: {
                username: { label: "Username", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req){
                return {
                    id: 'dummy id',
                    email: 'dummy email',
                }
            },
        })
    ],
    callbacks: {
        session: async ({session, token}) => {
            // @ts-expect-error
            session.accessToken = token.token.account.access_token;
            session.user = parseUsrFromToken(token);
            return session;
        },
    }
}

const clientId = process.env.AWS_CLIENT || "";
const clientSecret = process.env.AWS_CLIENT_SECRET || "";
const userPoolId = process.env.AWS_POOL_ID || "";
const region = process.env.AWS_REGION || "";

export const cognitoConfig : NextAuthOptions = {
    secret: "secret",
    providers: [
        CognitoProvider({
            clientId: clientId,
            clientSecret: clientSecret,
            issuer: new URL(userPoolId, `https://cognito-idp.${region}.amazonaws.com`).href,
            idToken: true,
        }),
    ],
    session:{
        strategy: 'jwt',
        maxAge: 60 * 60, // session timeout, user either log in again or new token is requested with refresh token
    },
    callbacks: {
        jwt: async (token) => {
            return Promise.resolve(token);
        },
        session: async ({session, token}) => {
            // @ts-expect-error
            session.accessToken = token.token.account.access_token;
            session.user = parseUsrFromToken(token);
            return session;
        },
    }
}

function parseUsrFromToken(token: JWT){
    // @ts-expect-error
    const profile = token.token.profile
    return {
        username: profile['cognito:username'],    
        firstName: profile.given_name,
        lastName: profile.family_name,
        phone_number: profile.phone_number,
        email: profile.email,
    }
}


export function getAuthOptions(): NextAuthOptions{
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
