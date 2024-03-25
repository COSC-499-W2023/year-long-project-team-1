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
  CardFooter,
  Alert,
} from "@patternfly/react-core";
import ProfilePicture from "@components/layout/ProfilePicture";
import { User } from "next-auth";
import Link from "next/link";
import { UserRole } from "@lib/userRole";
import { CognitoUser, getUsrList } from "@lib/cognito";

interface ProfileDetailsProps {
  user: User;
  withUser: string;
}

export const OtherUserProfileDetails = ({
  user,
  withUser,
}: ProfileDetailsProps) => {
  const [userDetails, setUserDetails] = useState<CognitoUser | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const users = await getUsrList("username", withUser, "=");
        if (users && users.length > 0) {
          setUserDetails(users[0]);
        } else {
          setUserDetails(null);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUserDetails(null);
      }
    };

    fetchUserDetails();
  }, [withUser]);
  if (!userDetails) {
    return (
      <Alert
        variant="danger"
        title="User details not found."
        style={{ width: "400px", marginTop: "1rem" }}
      />
    );
  }

  const withUserRole = user.role === UserRole.PROFESSIONAL
    ? UserRole.CLIENT
    : UserRole.PROFESSIONAL;

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
            {/* <ProfilePicture
                            tooltip={`Logged in as ${user.username}`}
                            user={user}
                            style={{ marginLeft: "1rem" }}
                            width="100px"
                        /> */}
          </FlexItem>
        </Flex>
      </CardBody>
      <CardFooter>
        {/* Uncomment if needed
        <Link href="/user/update">Edit your information</Link>
        <Divider /> */}
        <Link href="https://authenticator.auth.ca-central-1.amazoncognito.com/forgotPassword?client_id=330k2k2cc5sr80qnhqglckvb8m&scope=openid&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fcognito&state=WBABdjil2pKIgaZJ64fEDrQ1rXeI3M7rBltPMwz5Fz8">
          Edit your password
        </Link>
      </CardFooter>
    </Card>
  );
};
