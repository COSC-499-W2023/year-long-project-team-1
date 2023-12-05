/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */

"use client";

import { LogoutButton } from "@components/auth/button/LogoutButton";
import { PrivacyPalAuthUser } from "@lib/auth";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardTitle,
    Divider,
    Flex,
    FlexItem,
    TextInput,
    Title,
} from "@patternfly/react-core";
import { User } from "@prisma/client";
import Link from "next/link";

const style = {
    card: {
        height: "100%",
    },
    userData: {
        marginTop: "1rem",
        marginBottom: "1rem",
        width: "100%",
    },
    link: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
    },
};

interface UserCardProps {
    user: User;
}

export const UserCard = ({ user }: UserCardProps) => {
    return (
        <Card style={style.card} aria-label="Your Personal Information">
            <CardHeader>
                <Flex justifyContent={{ default: "justifyContentSpaceBetween" }}>
                    <FlexItem>
                        <Title headingLevel="h2">Your Personal Information</Title>
                    </FlexItem>
                    <FlexItem>ID:&nbsp;{user.id}</FlexItem>
                </Flex>
            </CardHeader>
            <CardBody>
                <Divider />
                <Flex direction={{ default: "column" }} grow={{ default: "grow" }} style={style.userData}>
                    <FlexItem>
                        <Flex justifyContent={{ default: "justifyContentSpaceBetween" }}>
                            <FlexItem>
                                <Title headingLevel="h3">Name:</Title>
                            </FlexItem>
                            <FlexItem>
                                {user.firstname}&nbsp;{user.lastname}
                            </FlexItem>
                        </Flex>
                        <Flex justifyContent={{ default: "justifyContentSpaceBetween" }}>
                            <FlexItem>
                                <Title headingLevel="h3">Email:</Title>
                            </FlexItem>
                            <FlexItem>{user.email}</FlexItem>
                        </Flex>
                    </FlexItem>
                </Flex>
            </CardBody>
            <CardFooter style={style.link}>
                <Link href="/user/update">Edit your information</Link>
                <Link href="/user/edit_password">Edit your password</Link>
            </CardFooter>
        </Card>
    );
};

export default UserCard;
