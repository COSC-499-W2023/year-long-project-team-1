/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */
"use client";

import { Divider, Grid, GridItem, Panel, PanelHeader, PanelMain } from "@patternfly/react-core";
import { User } from "@prisma/client";

interface UserDashboardProps {
    user: User | null;
}

export const UserDashboard = ({ user }: UserDashboardProps) => {
    const dashboardMain = (
        <Panel>
            <PanelHeader>
                <h1>Hi, {user?.firstname}</h1>
            </PanelHeader>
            <Divider />
            <PanelMain>
                <p>User stuff.</p>
            </PanelMain>
        </Panel>
    );

    return (
        <Grid span={12}>
            <GridItem span={8}>{dashboardMain}</GridItem>
        </Grid>
    );
};

export default UserDashboard;
