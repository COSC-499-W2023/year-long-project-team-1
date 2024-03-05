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
} from "@patternfly/react-core";
import ProfilePicture from "@components/layout/ProfilePicture";
import { User } from "next-auth";
import Link from "next/link";
import { UserRole } from "@lib/userRole";
import { CognitoUser } from "@lib/cognito";
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
          direction={{ default: "row" }} // Set direction to "row"
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
              tooltip={`Logged in as ${user.username}`}
              user={user}
              style={{ marginLeft: "1rem" }}
              width="100px"
            />
          </FlexItem>
        </Flex>
      </CardBody>
      {/* Uncomment if needed
      <CardFooter>
        <Link href="/user/update">Edit your information</Link>
        <Divider />
        <Link href="/user/edit_password">Edit your password</Link>
      </CardFooter>
      */}
    </Card>
  );
};
