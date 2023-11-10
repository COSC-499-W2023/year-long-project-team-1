/*
 * Created on Thu Nov 09 2023
 * Author: Connor Doman
 */
"use client";

import { PrivacyPalAuthUser } from "@lib/auth";
import useUser from "@lib/state/useUser";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";

interface ExampleUserCardProps {
    customUser?: PrivacyPalAuthUser;
}

export const ExampleUserCard = ({ customUser }: ExampleUserCardProps) => {
    const { user } = useUser({ customUser });

    return (
        <Card>
            <CardTitle>Example User Card for {user?.email}</CardTitle>
            <CardBody>
                <pre>{JSON.stringify(user, null, 4)}</pre>
            </CardBody>
        </Card>
    );
};
