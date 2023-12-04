/*
 * Created on Wed Nov 29 2023
 * Author: Connor Doman
 */
"use client";

import { createAppointment, getLoggedInUser } from "@app/actions";
import {
    ActionList,
    ActionListItem,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardTitle,
    Form,
    FormGroup,
    FormHelperText,
    FormSelect,
    FormSelectOption,
    HelperText,
    HelperTextItem,
    Label,
    MenuToggle,
    MenuToggleElement,
    Select,
    SelectList,
    SelectOption,
    TextInput,
} from "@patternfly/react-core";
import { User } from "@prisma/client";
import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, Suspense, use, useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import useSWR from "swr";

interface NewAppointmentFormProps {
    professionalUser: User;
}

export const NewAppointmentForm = ({ professionalUser }: NewAppointmentFormProps) => {
    const { pending } = useFormStatus();
    const [state, formAction] = useFormState(createAppointment, undefined);
    const [selectedClient, setSelectedClient] = useState<number | undefined>(undefined);

    const {
        data: { data } = { clients: [] },
        error,
        isLoading: clientsLoading,
    } = useSWR<{ data: User[] }>("/api/users/clients", (url: string) => fetch(url).then((res) => res.json()));

    const onSelect = (_event: FormEvent<HTMLSelectElement>, value: string) => {
        const newClient = data?.find((client) => client.id === parseInt(value));

        if (!newClient) {
            setSelectedClient(undefined);
            return;
        }

        console.log("Selecting client: ", newClient);
        setSelectedClient(newClient.id);
    };

    const clientSelectOptions = data
        ? data.map((client: User) => {
              return (
                  <FormSelectOption
                      value={client.id}
                      key={client.id}
                      label={client.firstname + " " + client.lastname}
                  />
              );
          })
        : null;

    const userFullName = (user: User | undefined) => {
        if (!user) return "";
        return user.firstname + " " + user.lastname;
    };

    return (
        <Card>
            <CardTitle title="h1">New Appointment</CardTitle>
            <CardBody>
                <Form action={formAction}>
                    <FormGroup label="Your name:" type="string" fieldId="pro-name">
                        <TextInput
                            aria-label="pro-name"
                            name="pro-name"
                            placeholder="Professional's Name"
                            isDisabled={true}
                            value={userFullName(professionalUser)}
                            isRequired
                            data-ouia-component-id="login_pro_name"
                        />
                    </FormGroup>
                    <Suspense fallback={<p>Loading...</p>}>
                        <FormGroup label="The client's name:" type="string" fieldId="client">
                            <FormSelect
                                name="client-id"
                                aria-label="Select a client"
                                id="client-id"
                                value={selectedClient}
                                onChange={onSelect}
                                aria-disabled={clientsLoading || error}>
                                <FormSelectOption value="0" key="empty" label="Select a client" isPlaceholder={true} />
                                {clientSelectOptions}
                            </FormSelect>
                        </FormGroup>
                    </Suspense>
                    <ActionList>
                        <ActionListItem>
                            <Button variant="primary" type="submit" isDisabled={pending}>
                                Submit
                            </Button>
                        </ActionListItem>
                    </ActionList>
                </Form>
            </CardBody>
        </Card>
    );
};

export default NewAppointmentForm;
