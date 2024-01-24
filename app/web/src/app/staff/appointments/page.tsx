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

import { getLoggedInUser } from "@app/actions";
import { getUserAppointments } from "@app/actions";
import AppointmentViewer from "@components/appointment/AppointmentViewer";
import { redirect } from "next/navigation";
import { ViewableAppointment } from "@lib/appointment";

export default async function ViewAppointmentDetailsForm() {
    const professional = await getLoggedInUser();
    if (!professional) redirect("/login");

    // get appointments
    

    const appt: ViewableAppointment = {

    };

    return (
        <main>
            <AppointmentViewer appointment={appt}/>
        </main>
    );
};
