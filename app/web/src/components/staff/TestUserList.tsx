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

"use client";

import { useState, useEffect } from "react";
import { getAllUserData } from "@app/actions";
import {
  Card,
  CardBody,
  CardTitle,
  Text,
  TextVariants,
} from "@patternfly/react-core";
import { PrivacyPalTable } from "@components/layout/PrivacyPalTable";
import { CognitoUser } from "@lib/cognito";
import Loading from "@app/loading";

const explanation =
  "This page will eventually only be accessible to staff members. As an example, the list of users below is only visible to staff members.";

export const TestUserList = () => {
  const [users, setUsers] = useState<CognitoUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUserData().then((data) => {
      if (data) {
        setUsers(data);
      }
      setLoading(false);
    });
  }, []);

  return (
    <Card aria-label="Example user list">
      <CardTitle component="h2">Users List</CardTitle>
      <CardBody>
        <Text component={TextVariants.p}>{explanation}</Text>
        {loading ? (
          <Loading />
        ) : (
          <PrivacyPalTable<CognitoUser>
            data={users}
            headings={Object.keys(users.length > 0 ? users[0] : [])}
          />
        )}
      </CardBody>
    </Card>
  );
};
