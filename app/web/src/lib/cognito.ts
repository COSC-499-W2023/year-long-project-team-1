import { AdminUserGlobalSignOutCommand, CognitoIdentityProviderClient, GlobalSignOutCommand } from "@aws-sdk/client-cognito-identity-provider";

export const client = new CognitoIdentityProviderClient();

export async function signOutFromCognito(accessToken: string){
    // const input = {
    //     AccessToken: accessToken
    // }
    // const command = new GlobalSignOutCommand(input);
    // const response = await client.send(command);
}
