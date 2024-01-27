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
import { Session } from "next-auth";
import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, Suspense, use, useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import useSWR from "swr";

interface NewAppointmentFormProps {
  professionalUser: Session["user"];
}

export interface Client {
  username: string,
  firstName: string,
  lastName: string,
  email: string,
}

export const NewAppointmentForm = ({
  professionalUser,
}: NewAppointmentFormProps) => {
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(createAppointment, undefined);
  const [selectedClient, setSelectedClient] = useState<string | undefined>(
    undefined,
  );

  const {
    data: { data } = { clients: [] },
    error,
    isLoading: clientsLoading,
  } = useSWR<{ data: Client[] }>("/api/users/clients", (url: string) =>
    fetch(url).then((res) => res.json()),
  );

  const onSelect = (_event: FormEvent<HTMLSelectElement>, value: string) => {
    const newClient = data?.find((client) => client.username === value);

    if (!newClient) {
      setSelectedClient(undefined);
      return;
    }

    console.log("Selecting client: ", newClient);
    setSelectedClient(newClient.username);
  };

  const clientSelectOptions = data
    ? data.map((client: Client) => {
        return (
          <FormSelectOption
            value={client.username}
            key={client.username}
            label={client.firstName + " " + client.lastName}
          />
        );
      })
    : null;

  const userFullName = (user: Session["user"] | undefined) => {
    if (!user) return "";
    return user.firstName + " " + user.lastName;
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
            <FormGroup
              label="The client's name:"
              type="string"
              fieldId="client"
            >
              <FormSelect
                name="client-id"
                aria-label="Select a client"
                id="client-id"
                value={selectedClient}
                onChange={onSelect}
                aria-disabled={clientsLoading || error}
              >
                <FormSelectOption
                  value="0"
                  key="empty"
                  label="Select a client"
                  isPlaceholder={true}
                />
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
