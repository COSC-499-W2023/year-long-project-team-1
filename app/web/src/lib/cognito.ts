import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export const client = new CognitoIdentityProviderClient();

export async function getUsrList() {
  const res = await client.send(
    new ListUsersCommand({
      UserPoolId: process.env.AWS_POOL_ID || "",
    }),
  );
  return res;
}
