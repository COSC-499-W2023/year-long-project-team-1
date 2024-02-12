"use client";

import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { getAllProfessionalAppointmentDetails } from "@app/actions";
import AppointmentViewer from "./AppointmentViewer";

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
