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

import { useEffect, useState } from "react";
import { getAllProfessionalAppointmentDetails } from "@app/actions";
import AppointmentViewer from "./AppointmentViewer";
import { User } from "next-auth";
import Loading from "@app/loading";

interface AppointmentManagementListProps {
  professional: User;
}

export default function AppointmentManagementList({
  professional,
}: AppointmentManagementListProps) {
  const [appointments, setAppointments] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAllProfessionalAppointmentDetails(professional).then((i) => {
      let componentList: JSX.Element[] = [];
      i.forEach((j, count) => {
        componentList.push(
          <AppointmentViewer
            appointment={j}
            viewer={professional}
            key={count}
          />,
        );
      });
      setAppointments(componentList);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (appointments.length > 0) {
    return (
      <div style={{ maxWidth: "100%", minWidth: "40rem" }}>{appointments}</div>
    );
  }

  return <p>No appointments found.</p>;
}
