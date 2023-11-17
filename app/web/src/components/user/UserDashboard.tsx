/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */
"use client";

import {
    Card,
    CardBody,
    CardTitle,
    Divider,
    Grid,
    GridItem,
    Panel,
    PanelHeader,
    PanelMain,
    Title,
} from "@patternfly/react-core";
import { User } from "@prisma/client";
import { ExampleUserCard } from "./ExampleUserCard";
import { PrivacyPalAuthUser } from "@lib/auth";
import { PrivacyPalDataList } from "@components/layout/PrivacyPalDataList";
import { useEffect, useState } from "react";
import { Appointment, getUserAppointments } from "@app/actions";

interface UserDashboardProps {
    user: User;
}

export const UserDashboard = ({ user }: UserDashboardProps) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        getUserAppointments(user.id).then((appts) => {
            if (!appts) {
                return;
            }
            setAppointments(appts);
        });
    }, []);

    const upcomingAppointments = (
        <Card>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardBody>
                <PrivacyPalDataList data={appointments} headings={["Date", "Appointment"]} />
            </CardBody>
        </Card>
    );
    const dashboardMain = <ExampleUserCard user={user} />;

    return (
        <Grid span={12}>
            <GridItem span={12}>
                <Title headingLevel="h1">Hi, {user?.firstname}</Title>
                <Divider />
            </GridItem>
            <GridItem span={4}>{upcomingAppointments}</GridItem>
            <GridItem span={8}>{dashboardMain}</GridItem>
        </Grid>
    );
};

export default UserDashboard;
