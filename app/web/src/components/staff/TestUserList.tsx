/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */
"use client";

import { useState, useEffect } from "react";
import { getAllUserData } from "@app/actions";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";
import { User } from "@prisma/client";
import { PrivacyPalTable } from "@components/PrivacyPalTable";

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
        <Card>
            <CardTitle>Users List</CardTitle>
            <CardBody>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <PrivacyPalTable<User> data={users} headings={Object.keys(users.length > 0 ? users[0] : [])} />
                )}
            </CardBody>
        </Card>
    );
};
