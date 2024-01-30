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
  AttributeType,
  CognitoIdentityProviderClient,
  ListUsersCommand,
  ListUsersInGroupCommand,
  UserType,
} from "@aws-sdk/client-cognito-identity-provider";
export const client = new CognitoIdentityProviderClient();

const userPoolId = process.env.AWS_POOL_ID || "";

/**
 * Call Cognito and returns all user information in user pool
 * @returns returns list of objects of type
 * { username: string,
 *   email: string,
 *   familyName: string,
 *   givenName: string,
 *   phoneNumber: string }
 *
 */
export async function getUsrList() {
  const res = await client.send(
    new ListUsersCommand({
      UserPoolId: userPoolId,
      AttributesToGet: ["email", "family_name", "given_name", "phone_number"],
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
 * @returns returns list of objects of type
 * { username: string,
 *   email: string,
 *   familyName: string,
 *   givenName: string,
 *   phoneNumber: string }
 */
export async function getUsrInGroupList(role: string) {
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

function parseUsersInfo(users: UserType[]) {
  const result: { [k: string]: any }[] = [];
  users?.forEach((user) => {
    const parsedAttributes = user.Attributes
      ? parseAttributes(user.Attributes)
      : {};
    result.push({
      ...parsedAttributes,
      username: user.Username,
    });
  });
  return result;
}

function parseAttributes(attributes: AttributeType[]) {
  const result: { [k: string]: any } = {};
  attributes.forEach((a) => {
    let attrName = a.Name?.split("_");
    if (attrName) {
      let key = attrName[0];
      if (attrName[1]) {
        key += attrName[1]?.charAt(0).toUpperCase() + attrName[1]?.slice(1);
      }
      result[key] = a.Value;
    }
  });
  return result;
}
