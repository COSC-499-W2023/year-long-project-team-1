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
import React from "react";
import { Card, CardTitle } from "@patternfly/react-core";
import { PrivacyPalDataList } from "@components/layout/PrivacyPalDataListDetail";
import { getUserAppointmentsDate } from "@app/actions";
import { SelectBasic } from "@components/form/SelectButton";
import logo from "@assets/dark_logo_no_name.png";
import Image from "next/image";
import { User } from "next-auth";
import { Stylesheet } from "@lib/utils";

interface AppointmentListProps {
  user: User;
}

const styles: Stylesheet = {
  titleHeading: {
    fontSize: "30px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
  },
  dataListContainer: {},
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1rem",
  },
  logo: {
    maxWidth: "4rem",
    height: "auto",
    marginRight: "1rem",
  },

  selectBasic: {
    marginBottom: "0",
  },
  dataList: {
    flex: 1,
    overflowY: "auto",
  },
};

const AppointmentList: React.FC<AppointmentListProps> = ({ user }) => {
  const [appointments, setAppointments] = React.useState<
    {
      professional: string;
      client: string;
      time: Date;
    }[]
  >([]);

  React.useEffect(() => {
    getUserAppointmentsDate(user).then((appts) => {
      if (!appts) {
        return;
      }
      const transformedAppointments = appts.map((appointment) => ({
        professional: appointment.professional,
        client: appointment.client,
        time: new Date(appointment.time),
      }));
      setAppointments(transformedAppointments);
    });
  }, [user]);

  return (
    <div>
      {/* <BackgroundImageBasic /> */}
      <Card style={styles.dataListContainer}>
        <div style={styles.headerContainer}>
          <CardTitle component="h4" style={styles.titleHeading}>
            <Image alt="logo" style={styles.logo} src={logo} />
            Appointments
          </CardTitle>
          <SelectBasic />
        </div>
        <PrivacyPalDataList
          data={appointments}
          headings={["Professional", "Client", "Date"]}
        />
      </Card>
    </div>
  );
};

export default AppointmentList;
