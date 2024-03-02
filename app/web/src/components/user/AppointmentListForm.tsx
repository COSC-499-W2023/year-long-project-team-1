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
import { useEffect, useState } from "react";
import { Card, CardTitle } from "@patternfly/react-core";
import { getUserAppointmentDetails } from "@app/actions";
import { SelectBasic } from "@components/form/SelectButton";
import logo from "@assets/dark_logo_no_name.png";
import Image from "next/image";
import { User } from "next-auth";
import AppointmentViewer from "@components/appointment/AppointmentViewer";

interface AppointmentListProps {
  user: User;
}

const styles: {
  titleHeading: React.CSSProperties;
  dataListContainer: React.CSSProperties;
  headerContainer: React.CSSProperties;
  logo: React.CSSProperties;
  selectBasic: React.CSSProperties;
  dataList: React.CSSProperties;
} = {
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

interface AppointmentListProps{
  user: User;
}

export default function AppointmentListForm({
  user,
}: AppointmentListProps) {
  const [appointments, setAppointments] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getUserAppointmentDetails(user).then((i) => {
      let componentList: JSX.Element[] = [];
      i.forEach((j, count) => {
        componentList.push(
          <AppointmentViewer
            appointment={j}
            viewer={user}
            key={count}
          />,
        );
      });
      setAppointments(componentList);
      setLoading(false);
    });
  }, []);

  return (
    <main>
      {loading ? (
        <div>Loading...</div>
      ) : appointments.length > 0 ? (
        appointments
      ) : (
        "No appointments found."
      )}
    </main>
  );
}
