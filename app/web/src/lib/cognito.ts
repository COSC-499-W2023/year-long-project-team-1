/*
 * Copyright [2023] [Privacypal Authors]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  AdminAddUserToGroupCommand,
  AdminCreateUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminRespondToAuthChallengeCommand,
  AttributeType,
  ChallengeNameType,
  CognitoIdentityProviderClient,
  ListUsersCommand,
  ListUsersInGroupCommand,
  UserType,
} from "@aws-sdk/client-cognito-identity-provider";
import { UserRole } from "./userRole";
import { User } from "next-auth";
import { createHmac } from "crypto";

const userPoolId = process.env.COGNITO_POOL_ID || "";
const clientId = process.env.COGNITO_CLIENT || "";
const clientSecret = process.env.COGNITO_CLIENT_SECRET || "";

export const client = new CognitoIdentityProviderClient();
export interface CognitoUser {
  username?: string;
  email?: string;
  lastName?: string;
  firstName?: string;
}

/**
 * Construct a Cognito filter string
 * @param username string
 * @returns string
 */
export function getClientSecretHash(username: string) {
  const hasher = createHmac("sha256", clientSecret);
  hasher.update(`${username}${clientId}`);
  return hasher.digest("base64");
}

/**
 * Construct a Cognito filter string
 * @param key the Cognito attribute to filter by
 * @param value the value to search for
 * @param operator the operator to use for the filter, must be one of "=" (exact match) or "^=" (matching prefix)
 * @returns a string that can be used as a filter in a Cognito API call or undefined if the value is not provided
 */
function buildCognitoFilter(
  key: string,
  value?: string,
  operator: "=" | "^=" = "^=",
): string | undefined {
  if (!value) {
    return undefined;
  }
  return `\"${key}\"${operator}\"${value}\"`;
}

/**
 * Call Cognito and returns all user information in user pool
 * @param filterBy attribute to filter by, must be one of "username", "email", "familyName", "givenName"
 * @param filterValue attribute value to filter by
 * @param operator filter operator, must be one of "=" (exact match) or "^=" (matching prefix)
 * @returns returns list of CognitoUser
 * { username: string,
 *   email: string,
 *   familyName: string,
 *   givenName: string }
 *
 */
export async function getUsrList(
  filterBy?: "username" | "email" | "familyName" | "givenName",
  filterValue?: string,
  operator: "=" | "^=" = "^=",
): Promise<CognitoUser[] | null> {
  if (filterBy && !filterValue) {
    Promise.reject("Missing filter value.");
  }

  let filter: string | undefined;
  switch (filterBy) {
    case "email": {
      filter = buildCognitoFilter("email", filterValue, operator);
      break;
    }
    case "username": {
      filter = buildCognitoFilter("username", filterValue, operator);
      break;
    }
    case "familyName": {
      filter = buildCognitoFilter("familyName", filterValue, operator);
      break;
    }
    case "givenName": {
      filter = buildCognitoFilter("givenName", filterValue, operator);
      break;
    }
  }
  const res = await client.send(
    new ListUsersCommand({
      UserPoolId: userPoolId,
      AttributesToGet: ["email", "family_name", "given_name"],
      Filter: filter,
    }),
  );
  if (res.Users) {
    return parseUsersInfo(res.Users);
  }
  return null;
}

/**
 * Call Cognito and returns specified user information in user pool
 * @param filterBy attribute to filter by, must be one of "username", "email", "familyName", "givenName"
 * @param filterValue attribute value to filter by
 * @param attributes array of attribute strings to query cognito for
 * @returns returns list of CognitoUser with the specified attributes
 * { attributes[0]: string,
 *   attributes[1]: string,
 *   etc }
 *
 */
export async function getUsrListCustomAttributes(
  filterBy?: "username" | "email" | "familyName" | "givenName",
  filterValue?: string,
  attributes?: string[],
): Promise<CognitoUser[] | null> {
  if (filterBy && !filterValue) {
    Promise.reject("Missing filter value.");
  }
  let filter: string | undefined;
  switch (filterBy) {
    case "email": {
      filter = `\"email\"^=\"${filterValue}\"`;
      break;
    }
    case "username": {
      filter = `\"username\"^=\"${filterValue}\"`;
      break;
    }
    case "familyName": {
      filter = `\"familyName\"^=\"${filterValue}\"`;
      break;
    }
    case "givenName": {
      filter = `\"givenName\"^=\"${filterValue}\"`;
      break;
    }
  }
  const res = await client.send(
    new ListUsersCommand({
      UserPoolId: userPoolId,
      AttributesToGet: attributes,
      Filter: filter,
    }),
  );
  if (res.Users) {
    return parseUsersInfo(res.Users);
  }
  return null;
}

/**
 *
 * Call Cognito and returns list of users in group
 * @param role usergroup name
 * @returns returns list of CognitoUser
 * { username: string,
 *   email: string,
 *   familyName: string,
 *   givenName: string }
 */
export async function getUsrInGroupList(
  role: UserRole,
): Promise<CognitoUser[] | null> {
  const res = await client.send(
    new ListUsersInGroupCommand({
      UserPoolId: userPoolId,
      GroupName: role,
    }),
  );
  if (res.Users) {
    return parseUsersInfo(res.Users);
  }
  return null;
}

function parseUsersInfo(users: UserType[]): CognitoUser[] {
  const result: CognitoUser[] = [];
  users?.forEach((user) => {
    let parsedUser: CognitoUser = {
      username: user.Username,
    };
    user.Attributes?.forEach((attribute: AttributeType) => {
      switch (attribute.Name) {
        case "family_name": {
          parsedUser.lastName = attribute.Value;
          break;
        }
        case "given_name": {
          parsedUser.firstName = attribute.Value;
          break;
        }
        case "email": {
          parsedUser.email = attribute.Value;
          break;
        }
      }
    });
    result.push(parsedUser);
  });
  return result;
}

interface NewUserInfo {
  username: string;
  email: string;
}
/**
 *
 * Call Cognito and create new user in user pool
 * @param username string
 * @param email string
 * @returns AdminCreateUserResponse
 * {
 *   User: {
 *     Username: "STRING_VALUE",
 *     Attributes: [
 *       {
 *         Name: "STRING_VALUE",
 *         Value: "STRING_VALUE",
 *       },
 *     ],
 *     UserCreateDate: new Date("TIMESTAMP"),
 *     UserLastModifiedDate: new Date("TIMESTAMP"),
 *     Enabled: true || false,
 *     UserStatus: "UNCONFIRMED" || "CONFIRMED" || "ARCHIVED" || "COMPROMISED" || "UNKNOWN" || "RESET_REQUIRED" || "FORCE_CHANGE_PASSWORD",
 *     MFAOptions: [
 *       {
 *         DeliveryMedium: "SMS" || "EMAIL",
 *         AttributeName: "STRING_VALUE",
 *       },
 *     ],
 *   },
 * };
 */
export async function createUser(info: NewUserInfo) {
  const input = {
    UserPoolId: userPoolId,
    Username: info.username,
    UserAttributes: [
      {
        Name: "email",
        Value: info.email,
      },
    ],
  };
  const command = new AdminCreateUserCommand(input);
  const response = await client.send(command);
  return response;
}

interface GroupInfo {
  username: string;
  groupName: UserRole;
}

/**
 * Add user to cognito group given user name
 * @param username string
 * @param groupName string
 * @return AdminAddUserToGroupCommand Output
 *
 */
export async function addUserToGroup(info: GroupInfo) {
  const input = {
    UserPoolId: userPoolId,
    Username: info.username,
    GroupName: info.groupName,
  };

  const command = new AdminAddUserToGroupCommand(input);
  const response = client.send(command);
  return response;
}

/**
 * Update the user's attributes
 * @param user NextAuth/Session User object
 * @param attributes key/value array of the form: [{Name: "attribute_name", Value: "attribute_value"}, {..., ...}, ...]
 * @return AdminUpdateUserAttributesCommand output
 */
export async function updateUserAttributes(
  user: User,
  attributes: AttributeType[],
) {
  const input = {
    UserAttributes: attributes,
    UserPoolId: userPoolId,
    Username: user.username,
  };

  const command = new AdminUpdateUserAttributesCommand(input);
  const response = await client.send(command);
  return response;
}

/**
 * Add user to cognito group given user name
 * @param info \{username: string, email: string, lastName: string, firstName: string, newPassword: string\}
 * @param session string
 * @return AdminRespondToAuthChallengeCommandOutput
 *
 */
export async function respondToAuthChallenge(
  info: CognitoUser & { newPassword: string },
  session: string,
) {
  const input = {
    UserPoolId: userPoolId,
    ClientId: clientId, // required
    ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED, // required
    Session: session,
    ChallengeResponses: {
      NEW_PASSWORD: info.newPassword,
      USERNAME: info.username!,
      "userAttributes.given_name": info.firstName!,
      "userAttributes.family_name": info.lastName!,
      SECRET_HASH: getClientSecretHash(info.username!),
    },
  };
  const command = new AdminRespondToAuthChallengeCommand(input);
  const response = await client.send(command);
  return response;
}
