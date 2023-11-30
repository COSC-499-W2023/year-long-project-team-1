/*
 * Created on Wed Nov 29 2023
 * Author: Connor Doman
 */
"use client";

import { createAppointment } from "@app/actions";
import {
    ActionList,
    ActionListItem,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardTitle,
    TextInput,
} from "@patternfly/react-core";
import { User } from "@prisma/client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

export const NewAppointmentForm = async () => {
    const [clientsList, setClientsList] = useState<User[]>([]);

    useEffect(() => {
        fetch("/api/clients")
            .then((res) => res.json())
            .then((data) => setClientsList(data));
    }, []);

    return (
        <Card component="form" action={createAppointment}>
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
            <CardFooter>
                <ActionList>
                    <ActionListItem>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </ActionListItem>
                </ActionList>
            </CardFooter>
        </Card>
    );
};

export default NewAppointmentForm;
