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
};

interface UserCardProps {
    user: User;
}

export const UserCard = ({ user }: UserCardProps) => {
    return (
        <Card style={style.card}>
            <CardHeader>
                <Flex justifyContent={{ default: "justifyContentSpaceBetween" }}>
                    <FlexItem>
                        <Title headingLevel="h2">Your Personal Data</Title>
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
            <CardFooter>
                <Link href="/user/edit">Edit your data</Link>
            </CardFooter>
        </Card>
    );
};

export default UserCard;
