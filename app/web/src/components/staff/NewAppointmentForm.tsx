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
    MenuToggle,
    MenuToggleElement,
    Select,
    SelectList,
    SelectOption,
    TextInput,
} from "@patternfly/react-core";
import { User } from "@prisma/client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import useSWR from "swr";

interface NewAppointmentFormProps {
    proId: string;
}

export const NewAppointmentForm = () => {
    const { pending } = useFormStatus();
    const [state, formAction] = useFormState(createAppointment, undefined);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedClientText, setSelectedClientText] = useState<string>("Select a client");
    const [selectedClient, setSelectedClient] = useState<User | undefined>(undefined);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    const {
        data: { data } = { clients: [] },
        error,
        isLoading: clientsLoading,
    } = useSWR<{ data: User[] }>("/api/users/clients", (url: string) => fetch(url).then((res) => res.json()));

    const onToggleClick = () => {
        setIsOpen(!isOpen);
    };

    const onSelect = (
        _event: React.MouseEvent<Element, MouseEvent> | undefined,
        value: string | number | undefined
    ) => {
        const newClient = data?.find((client) => client.id === value);

        setSelectedClient(newClient);
        setSelectedClientText(`${newClient?.firstname} ${newClient?.lastname}`);
        setIsOpen(false);
    };

    const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle ref={toggleRef} onClick={onToggleClick} isExpanded={isOpen} isDisabled={isDisabled}>
            {selectedClientText}
        </MenuToggle>
    );

    const clientSelectOptions = data
        ? data.map((client: User) => {
              return (
                  <SelectOption value={client.id} key={client.id}>
                      {client.firstname} {client.lastname}
                  </SelectOption>
              );
          })
        : null;

    const clientSelect = (
        <Select
            aria-label="Select a client"
            id="client-select"
            className="is this thing on?"
            isOpen={isOpen}
            selected={selectedClientText}
            onSelect={onSelect}
            onOpenChange={(isOpen) => setIsOpen(isOpen)}
            toggle={toggle}
            shouldFocusToggleOnSelect
            aria-disabled={clientsLoading || error}>
            <SelectList>{clientSelectOptions}</SelectList>
        </Select>
    );

    return (
        <Card>
            <CardTitle title="h1">New Appointment</CardTitle>
            <CardBody component="form" action={createAppointment}>
                <TextInput
                    aria-label="pro-name"
                    name="pro-name"
                    placeholder="Professional's Name"
                    isDisabled={true}
                    isRequired
                    data-ouia-component-id="login_pro_name"
                />
                <Suspense fallback={<p>Loading...</p>}>{clientSelect}</Suspense>
                <input type="hidden" value={selectedClient?.id} name="client" id="client" />
                <ActionList>
                    <ActionListItem>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </ActionListItem>
                </ActionList>
            </CardBody>
        </Card>
    );
};

export default NewAppointmentForm;
