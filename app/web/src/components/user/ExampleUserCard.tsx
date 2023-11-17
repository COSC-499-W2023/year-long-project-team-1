/*
 * Created on Thu Nov 09 2023
 * Author: Connor Doman
 */
"use client";

import { PrivacyPalAuthUser } from "@lib/auth";
import { Button, Card, CardBody, CardFooter, CardTitle } from "@patternfly/react-core";
import { useRouter } from "next/navigation";

interface ExampleUserCardProps {
    user?: PrivacyPalAuthUser;
}

export const ExampleUserCard = ({ user }: ExampleUserCardProps) => {
    const router = useRouter();

    const handleLogout = () => {
        router.push("/api/auth/logout");
    };

    return (
        <Card>
            <CardTitle>Example User Card for {user?.email}</CardTitle>
            <CardBody>
                <pre>{JSON.stringify(user, null, 4)}</pre>
            </CardBody>
            <CardFooter>
                <Button variant="primary" onClick={handleLogout}>
                    Log out
                </Button>
            </CardFooter>
        </Card>
    );
};
