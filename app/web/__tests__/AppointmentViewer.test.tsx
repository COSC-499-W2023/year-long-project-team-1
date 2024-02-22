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

import AppointmentViewer from "@components/appointment/AppointmentViewer";
import { render, screen } from "@testing-library/react";
import { ViewableAppointment } from "@lib/appointment";
import { UserRole } from "@lib/userRole";

describe("AppointmentViewer Component", () => {
  const pro = {
    id: 1,
    username: "professional_test_user",
    email: "pro@example.com",
    firstName: "Pro",
    lastName: "User",
    role: UserRole.PROFESSIONAL,
  };
  const client = {
    id: 2,
    username: "client_test_user",
    email: "client@example.com",
    firstName: "Client",
    lastName: "User",
    role: UserRole.CLIENT,
  };
  const appt: ViewableAppointment = {
    id: 1,
    professionalUser: pro,
    clientUser: client,
    time: new Date(Date.UTC(2025, 0, 1, 12, 0, 0)), // jan 1st 2025 12:00 noon
    video_count: 1,
  };

  it("component is unchanged from snapshot", () => {
    const { container: container } = render(
      <div>
        <AppointmentViewer appointment={appt} viewer={pro} />,
        <AppointmentViewer appointment={appt} viewer={client} />
      </div>,
    );
    expect(container).toMatchSnapshot();
  });
  it("pro viewer has cancel and view details buttons", () => {
    const { container: proContainer } = render(
      <AppointmentViewer appointment={appt} viewer={pro} />,
    );
    expect(screen.getByText("Cancel appointment")).toBeDefined();
    expect(screen.getByText("View appointment details")).toBeDefined();
  });
  it("client viewer has upload video button", () => {
    const { container: clientContainer } = render(
      <AppointmentViewer appointment={appt} viewer={client} />,
    );
    expect(
      screen.getByText("Upload a video to this appointment"),
    ).toBeDefined();
  });
});
