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
import { PrivacyPalTable } from "@components/layout/PrivacyPalTable";
import {
  Bullseye,
  Button,
  Card,
  CardBody,
  CardTitle,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  Spinner,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import React, { useCallback, useEffect } from "react";
import { AttributeFilter } from "./AttributeFilter";
import { useRouter } from "next/navigation";
import { createAppointment } from "@app/actions";
import useSWRMutation from "swr/mutation";
import { SearchIcon } from "@patternfly/react-icons";

const fetcher = (
  url: string,
  {
    arg,
  }: {
    arg: {
      username: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  },
) => {
  return fetch(
    url +
      "?" +
      new URLSearchParams({
        username: arg.username,
        firstName: arg.firstName,
        lastName: arg.lastName,
        email: arg.email,
      }),
  ).then(async (response) => {
    const json = await response.json();
    return json.data;
  });
};

export const NewAppointmentForm = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [filterAttr, setFilterAttr] = React.useState<string>("Username");
  const [username, setUsername] = React.useState("");
  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [userData, setUserData] = React.useState([]);

  const { trigger, isMutating } = useSWRMutation("/api/clients", fetcher);

  // On first load, all client information is returned
  const fetchInitialData = useCallback(async () => {
    const data = await trigger({
      username: "",
      firstName: "",
      lastName: "",
      email: "",
    });
    setUserData(data);
  }, []);
  useEffect(() => {
    try {
      fetchInitialData();
    } catch (e) {
      console.log("Error: " + e);
    }
  }, [fetchInitialData]);

  const onSearch = async () => {
    try {
      const data = await trigger({
        username: username,
        firstName: firstname,
        lastName: lastname,
        email: email,
      });
      setUserData(data);
    } catch (e) {
      console.log("Error: " + e);
    }
  };

  const inviteClient = async (clientUsrname: string) => {
    const appointmentId = await createAppointment(clientUsrname);
    router.push(`/staff/appointments/${appointmentId}`);
  };

  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined,
  ) => {
    setFilterAttr(value as string);
    setIsOpen(false);
  };

  // Toggle attribute dropdown
  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };
  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggleClick}
      isExpanded={isOpen}
      style={
        {
          width: "200px",
        } as React.CSSProperties
      }
    >
      {filterAttr}
    </MenuToggle>
  );

  const attributeDropdown = (
    <Select
      id="single-select"
      isOpen={isOpen}
      selected={filterAttr}
      onSelect={onSelect}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      toggle={toggle}
      shouldFocusToggleOnSelect
    >
      <SelectList>
        <SelectOption value="Username">Username</SelectOption>
        <SelectOption value="Email">Email</SelectOption>
        <SelectOption value="First name">First name</SelectOption>
        <SelectOption value="Last name">Last name</SelectOption>
      </SelectList>
    </Select>
  );

  const toolbar = (
    <Toolbar>
      <ToolbarContent>
        <ToolbarGroup variant="filter-group">
          <ToolbarItem>
            {attributeDropdown}
            <AttributeFilter
              display={filterAttr === "Username"}
              valueDisplayed={username}
              onChange={(value) => setUsername(value)}
              category={"Username"}
            />
            <AttributeFilter
              display={filterAttr === "First name"}
              valueDisplayed={firstname}
              onChange={(value) => setFirstname(value)}
              category={"First name"}
            />
            <AttributeFilter
              display={filterAttr === "Last name"}
              valueDisplayed={lastname}
              onChange={(value) => setLastname(value)}
              category={"Last name"}
            />
            <AttributeFilter
              display={filterAttr === "Email"}
              valueDisplayed={email}
              onChange={(value) => setEmail(value)}
              category={"Email"}
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button onClick={onSearch}>Search</Button>
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );

  const emptyState = (
    <EmptyState>
      <EmptyStateHeader
        headingLevel="h4"
        titleText="No results found"
        icon={<EmptyStateIcon icon={SearchIcon} />}
      />
      <EmptyStateBody>
        No results match the filter criteria. Clear all filters and try again.
      </EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>
          <Button
            variant="link"
            onClick={() => {
              setUsername("");
              setFirstname("");
              setLastname("");
              setEmail("");
            }}
          >
            Clear all filters
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );

  return (
    <Card style={{ minWidth: "100%" }}>
      <CardTitle title="h1">New Appointment</CardTitle>
      <CardBody>
        {toolbar}
        {isMutating && <Spinner style={{ alignSelf: "center" }} />}
        {!isMutating && userData.length > 0 && (
          <PrivacyPalTable
            data={userData}
            headings={[
              "Username",
              "Email",
              "Phone number",
              "Last name",
              "First name",
              "",
            ]}
            rowAction={(clientUsrname) => inviteClient(clientUsrname)}
          ></PrivacyPalTable>
        )}
        {!isMutating && userData.length == 0 && (
          <Bullseye>{emptyState}</Bullseye>
        )}
      </CardBody>
    </Card>
  );
};
