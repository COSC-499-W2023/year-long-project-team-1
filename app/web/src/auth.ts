import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CognitoProvider from "next-auth/providers/cognito";
import CredentialsProvider from 'next-auth/providers/credentials';

export const customAuthConfig : NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Basic Auth',
            credentials: {
                username: { label: "Username", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req){
                return {
                    id: 'dummy id',
                    email: 'dummy email',
                }
            }
        })
    ]
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
    },
    callbacks: {
        // @ts-ignore
        jwt: async (token) => {
        return Promise.resolve(token)
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
      name: profile.name,
      birthday: profile.birthdate,
      phone_number: profile.phone_number,
      email: profile.email,
    }
}
