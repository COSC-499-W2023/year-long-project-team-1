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
import { useFormState } from "react-dom";
import useSWR from "swr";

export const NewAppointmentForm = () => {
    const [clientsList, setClientsList] = useState<User[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<string>("Select a value");
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
        // eslint-disable-next-line no-console
        console.log("selected", value);

        setSelected(value as string);
        setIsOpen(false);
    };

    const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
            ref={toggleRef}
            onClick={onToggleClick}
            isExpanded={isOpen}
            isDisabled={isDisabled}
            style={
                {
                    width: "200px",
                } as React.CSSProperties
            }>
            {selected}
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
            id="single-select"
            isOpen={isOpen}
            selected={selected}
            onSelect={onSelect}
            onOpenChange={(isOpen) => setIsOpen(isOpen)}
            toggle={toggle}
            shouldFocusToggleOnSelect
            aria-disabled={clientsLoading || error}>
            <SelectList>{clientSelectOptions}</SelectList>
        </Select>
    );

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
                <Suspense fallback={<p>Loading...</p>}>{clientSelect}</Suspense>
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
