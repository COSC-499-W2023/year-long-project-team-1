/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */
"use client";

import { useState, useEffect } from "react";
import { getAllUserData } from "@app/actions";
import { Card, CardBody, CardTitle, Text, TextVariants } from "@patternfly/react-core";
import { User } from "@prisma/client";
import { PrivacyPalTable } from "@components/layout/PrivacyPalTable";

const explanation =
    "This page will eventually only be accessible to staff members. As an example, the list of users below is only visible to staff members.";

export const TestUserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllUserData().then((data) => {
            setUsers(data);
            setLoading(false);
        });
    }, []);

    return (
        <Card aria-label="Example user list">
            <CardTitle component="h2">Users List</CardTitle>
            <CardBody>
                <Text component={TextVariants.p}>{explanation}</Text>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <PrivacyPalTable<User> data={users} headings={Object.keys(users.length > 0 ? users[0] : [])} />
                )}
            </CardBody>
        </Card>
    );
};
