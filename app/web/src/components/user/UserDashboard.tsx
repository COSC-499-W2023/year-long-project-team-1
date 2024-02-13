/*
 * Copyright [2023] [Privacypal Authors]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use client";

import {
  Card,
  CardBody,
  CardTitle,
  Divider,
  Grid,
  GridItem,
  Title,
} from "@patternfly/react-core";
import { Appointment } from "@prisma/client";
import UserCard from "./UserCard";
import { PrivacyPalDataList } from "@components/layout/PrivacyPalDataList";
import { useEffect, useState } from "react";
import {
  Message,
  getUserAppointments,
  getUserRecentMessages,
} from "@app/actions";
import { PrivacyPalTable } from "@components/layout/PrivacyPalTable";
import { User } from "next-auth";

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
    getUserAppointments(user).then((appts) => {
      if (!appts) {
        return;
      }
      setAppointments(appts);
    });

    getUserRecentMessages(user.username).then((msgs) => {
      if (!msgs) {
        return;
      }
      setMessages(msgs);
    });
  }, []);

  const upcomingAppointments = (
    <Card
      style={styles.upcomingAppointments}
      aria-label="Upcoming Appointments"
    >
      <CardTitle component="h2">Upcoming Appointments</CardTitle>
      <CardBody>
        <PrivacyPalDataList
          data={appointments}
          headings={["Date", "Appointment"]}
        />
      </CardBody>
    </Card>
  );

  const dashboardMain = <UserCard user={user} />;

  const recentMessages = (
    <Card aria-label="Recent Messages">
      <CardTitle component="h2">Recent Messages</CardTitle>
      <CardBody>
        <PrivacyPalTable
          data={messages}
          headings={["Sender", "Message", "Date"]}
        />
      </CardBody>
    </Card>
  );

  return (
    <Grid span={12} aria-label="User Dashboard">
      <GridItem span={12}>
        <Title headingLevel="h1">Hi, {user?.firstName}</Title>
        <Divider />
      </GridItem>
      <GridItem span={4}>{upcomingAppointments}</GridItem>
      <GridItem span={8}>{dashboardMain}</GridItem>
      <GridItem span={12}>{recentMessages}</GridItem>
    </Grid>
  );
};

export default UserDashboard;
