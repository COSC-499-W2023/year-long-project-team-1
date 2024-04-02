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
import {
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Flex,
  Title,
  FlexItem,
  Divider,
  CardFooter,
} from "@patternfly/react-core";
import ProfilePicture from "@components/layout/ProfilePicture";
import { User } from "next-auth";
import Link from "next/link";
interface ProfileDetailsProps {
  user: User;
}
export const ProfileDetails = ({ user }: ProfileDetailsProps) => {
  return (
    <Card aria-label="Your Personal Information">
      <CardHeader style={{ textAlign: "center", marginBottom: "0.5rem" }}>
        <CardTitle
          component="h2"
          style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}
        >
          Your Personal Information
        </CardTitle>
      </CardHeader>

      <CardBody>
        <Divider></Divider>
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
                <span>{user.username}</span>
              </FlexItem>

              <FlexItem>
                <Title headingLevel="h2">Email:</Title>
                <span>{user.email}</span>
              </FlexItem>

              <FlexItem>
                <Title headingLevel="h2">Full Name:</Title>
                <span>
                  {user.firstName} {user.lastName}
                </span>
              </FlexItem>
              <FlexItem>
                <Title headingLevel="h2">Role:</Title>
                <span>{user.role || "N/A"}</span>
              </FlexItem>
            </Flex>
          </FlexItem>

          <FlexItem>
            <ProfilePicture
              user={user}
              style={{ marginLeft: "1rem" }}
              width="100px"
            />
          </FlexItem>
        </Flex>
      </CardBody>
      {/* Uncomment if needed */}
      <CardFooter>
        {/* <Link href="/user/update">Edit your information</Link> */}
        {/* <Divider /> */}
        <Link href="/profile/update/">Update your profile</Link>
      </CardFooter>
    </Card>
  );
};
