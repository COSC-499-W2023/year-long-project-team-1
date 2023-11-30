/*
 * Created on Wed Nov 29 2023
 * Author: Connor Doman
 */
"use client";

import { Card, CardBody, CardTitle, TextInput } from "@patternfly/react-core";
import { useSearchParams, useRouter } from "next/navigation";

export const NewAppointmentForm = async () => {
    return (
        <Card component="form" action="">
            <CardTitle title="h1">New Appointment</CardTitle>
            <CardBody>
                <TextInput
                    aria-label="appt-name"
                    name="appt-name"
                    placeholder="Appointment Name"
                    isRequired
                    data-ouia-component-id="login_appointment_name"
                />
                <TextInput
                    aria-label="appt-name"
                    name="appt-name"
                    placeholder="Appointment Name"
                    isRequired
                    data-ouia-component-id="login_appointment_name"
                />
            </CardBody>
        </Card>
    );
};

export default NewAppointmentForm;
