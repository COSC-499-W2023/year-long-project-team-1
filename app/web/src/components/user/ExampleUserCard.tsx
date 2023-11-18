/*
 * Created on Thu Nov 09 2023
 * Author: Connor Doman
 */
"use client";

import { LogoutButton } from "@components/auth/button/LogoutButton";
import { PrivacyPalAuthUser } from "@lib/auth";
import { Card, CardBody, CardFooter, CardTitle } from "@patternfly/react-core";
import { User } from "@prisma/client";

interface ExampleUserCardProps {
    user: PrivacyPalAuthUser | User;
}

export const ExampleUserCard = ({ user }: ExampleUserCardProps) => {
    return (
        <Card>
            <CardTitle>Example User Card for {user.email}</CardTitle>
            <CardBody>
                <pre>{JSON.stringify(user, null, 4)}</pre>
            </CardBody>
            <CardFooter>
                <LogoutButton />
            </CardFooter>
        </Card>
    );
};
