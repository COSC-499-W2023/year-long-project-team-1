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
import React, { useEffect, useState } from "react";
import {
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Flex,
  Title,
  FlexItem,
  Divider,
  Alert,
} from "@patternfly/react-core";
import { User } from "next-auth";
import { UserRole } from "@lib/userRole";
import { CognitoUser } from "@lib/cognito";
import { getUserByUsername } from "@app/actions";
import { CSS } from "@lib/utils";
import CustomAvatar from "@components/CustomAvatar";

const cardContainer: CSS = {
  display: "flex",
  justifyContent: "center",
  filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
};
interface ProfileDetailsProps {
  user: User;
  withUser: string;
}

export const OtherUserProfileDetails = ({
  user,
  withUser,
}: ProfileDetailsProps) => {
  const [userDetails, setUserDetails] = useState<CognitoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = await getUserByUsername(withUser);
        if (user) {
          setUserDetails(user);
          setLoading(false);
        } else {
          setLoading(false);
          setError("User details not found");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setLoading(false);
        setError("Error fetching user details");
      }
    };

    fetchUserDetails();
  }, [withUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="danger" title={error} style={{ marginTop: "1rem" }} />
    );
  }

  if (!userDetails) {
    return (
      <Alert
        variant="danger"
        title="User details not found."
        style={{ marginTop: "1rem" }}
      />
    );
  }

  const withUserRole =
    user.role === UserRole.PROFESSIONAL
      ? UserRole.CLIENT
      : UserRole.PROFESSIONAL;

  return (
      <Card aria-label="Personal Information">
        <CardHeader style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          <CardTitle
            component="h2"
            style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}
          >
            {withUserRole === UserRole.PROFESSIONAL
              ? "Professional's Information"
              : "Client's Information"}
          </CardTitle>
        </CardHeader>

        <CardBody>
          <Divider />
          <Flex
            direction={{ default: "row" }}
            alignItems={{ default: "alignItemsFlexStart" }}
            justifyContent={{ default: "justifyContentSpaceBetween" }}
            grow={{ default: "grow" }}
          >
            <FlexItem>
              <Flex direction={{ default: "column" }}>
                <FlexItem>
                  <Title headingLevel="h2">Username:</Title>
                  <span>{userDetails.username}</span>
                </FlexItem>

                <FlexItem>
                  <Title headingLevel="h2">Email:</Title>
                  <span>{userDetails.email}</span>
                </FlexItem>

                <FlexItem>
                  <Title headingLevel="h2">Full Name:</Title>
                  <span>
                    {userDetails.firstName} {userDetails.lastName}
                  </span>
                </FlexItem>
                <FlexItem>
                  <Title headingLevel="h2">Role:</Title>
                  <span>{withUserRole}</span>
                </FlexItem>
              </Flex>
            </FlexItem>

            <FlexItem>
              <CustomAvatar firstName={userDetails.firstName} lastName={userDetails.lastName} style={{width:"100px", height:"100px"}}/>
            </FlexItem>
          </Flex>
        </CardBody>
      </Card>
  );
};
