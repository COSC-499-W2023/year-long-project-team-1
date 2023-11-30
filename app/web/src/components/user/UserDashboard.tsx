/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */
"use client";

import { Card, CardBody, CardTitle, Divider, Grid, GridItem, Title } from "@patternfly/react-core";
import { User } from "@prisma/client";
import UserCard from "./UserCard";
import { PrivacyPalDataList } from "@components/layout/PrivacyPalDataList";
import { useEffect, useState } from "react";
import { Appointment, Message, getUserAppointments, getUserRecentMessages } from "@app/actions";
import { PrivacyPalTable } from "@components/layout/PrivacyPalTable";

const styles = {
    upcomingAppointments: {
        height: "100%",
    },
};

interface UserDashboardProps {
    user: User;
}

export const UserDashboard = ({ user }: UserDashboardProps) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        getUserAppointments(user.id).then((appts) => {
            if (!appts) {
                return;
            }
            setAppointments(appts);
        });

        getUserRecentMessages(user.id).then((msgs) => {
            if (!msgs) {
                return;
            }
            setMessages(msgs);
        });
    }, []);

    const upcomingAppointments = (
        <Card style={styles.upcomingAppointments}>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardBody>
                <PrivacyPalDataList data={appointments} headings={["Date", "Appointment"]} />
            </CardBody>
        </Card>
    );

    const dashboardMain = <UserCard user={user} />;

    const recentMessages = (
        <Card>
            <CardTitle>Recent Messages</CardTitle>
            <CardBody>
                <PrivacyPalTable data={messages} headings={["Sender", "Message", "Date"]} />
            </CardBody>
        </Card>
    );

    return (
        <Grid span={12}>
            <GridItem span={12}>
                <Title headingLevel="h1">Hi, {user?.firstname}</Title>
                <Divider />
            </GridItem>
            <GridItem span={4}>{upcomingAppointments}</GridItem>
            <GridItem span={8}>{dashboardMain}</GridItem>
            <GridItem span={12}>{recentMessages}</GridItem>
        </Grid>
    );
};

export default UserDashboard;