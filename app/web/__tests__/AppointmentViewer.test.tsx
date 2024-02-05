import AppointmentViewer from "@components/appointment/AppointmentViewer";

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
import { render, screen } from "@testing-library/react";
import { ViewableAppointment } from "@lib/appointment";
import { User } from "@prisma/client";

describe("AppointmentViewer Component", () => {
//   it("page", () => {});

  it("component is unchanged from snapshot", () => {
    const pro: User = {
      id: 1,
      username: "professional_test_user",
      password: "password",
      email: "pro@example.com",
      firstname: "Pro",
      lastname: "User",
      role: "PROFESSIONAL",
    };
    const client: User = {
      id: 2,
      username: "client_test_user",
      password: "password",
      email: "client@example.com",
      firstname: "Client",
      lastname: "User",
      role: "CLIENT",
    };
    const appt: ViewableAppointment = {
      id: 1,
      professionalUser: pro,
      clientUser: client,
      time: new Date(Date.now()),
      video_count: 1,
    };
    const { container } = render(<AppointmentViewer appointment={appt} viewer={client}/>);
    expect(container).toMatchSnapshot();
  });
});
