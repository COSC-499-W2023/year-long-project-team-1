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
import { createAppointment } from "@app/actions";
import { ErrorView } from "@components/ErrorView";
import {
  Bullseye,
  Button,
  Card,
  CardBody,
  CardTitle,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  Spinner,
  Toolbar,
  ToolbarChip,
  ToolbarChipGroup,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Tooltip,
} from "@patternfly/react-core";
import { SyncIcon } from "@patternfly/react-icons";
import { useRouter } from "next/navigation";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import useSWRMutation from "swr/mutation";
import { AttributeFilter } from "./AttributeFilter";
import { ClientInfo, ClientTable } from "./ClientTable";

const fetcher = async (
  url: string,
  {
    arg,
  }: {
    arg: ClientFilters;
  },
) => {
  const params = new URLSearchParams({
    username: arg.usernames.join(","),
    firstName: arg.firstnames.join(","),
    lastName: arg.lastnames.join(","),
    email: arg.emails.join(","),
  });

  return fetch(url + `?${params}`, {
    method: "GET",
  })
    .then((response) => {
      if (response.status != 200) {
        throw new Error(
          `Request for client list failed with status code: ${response.status}`,
        );
      }
      return response.json();
    })
    .then((body) => body.data);
};

export interface ClientFilters {
  usernames: string[];
  lastnames: string[];
  firstnames: string[];
  emails: string[];
}

export const getFilterForAttribute = (
  filters: ClientFilters,
  attr: FilterAttribute,
): [string, string[]] => {
  let filter, key;
  switch (attr) {
    case "Username":
      key = "usernames";
      filter = filters.usernames;
      break;
    case "First name":
      key = "firstnames";
      filter = filters.firstnames;
      break;
    case "Last name":
      key = "lastnames";
      filter = filters.lastnames;
      break;
    case "Email":
      key = "emails";
      filter = filters.emails;
      break;
  }
  return [key, filter];
};

export type FilterAttribute = "Username" | "Last name" | "First name" | "Email";

export const NewAppointmentForm = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [filterAttr, setFilterAttr] = useState<FilterAttribute>("Username");
  const [filters, setFilters] = useState<ClientFilters>({
    usernames: [],
    lastnames: [],
    firstnames: [],
    emails: [],
  });
  const [searchInput, setSearchInput] = useState("");
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [error, setError] = useState<Error | undefined>();

  const { trigger, isMutating } = useSWRMutation("/api/clients", fetcher);

  const refreshList = useCallback(() => {
    trigger(filters).then(setClients).catch(setError);
  }, [filters]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const onSearch = useCallback(() => {
    const currentSearchVal = searchInput;
    if (!currentSearchVal) {
      return;
    }
    setFilters((filters) => {
      const [attr, filter] = getFilterForAttribute(filters, filterAttr);
      return {
        ...filters,
        [attr]: Array.from(filter.concat(currentSearchVal)),
      };
    });
    setSearchInput("");
  }, [setFilters, setSearchInput, searchInput, filterAttr]);

  const onChipDelete = useCallback(
    (category: string | ToolbarChipGroup, value: string | ToolbarChip) => {
      setFilters((filters) => {
        const cat: FilterAttribute = (
          typeof category === "string" ? category : category.name
        ) as FilterAttribute;
        const filterVal = typeof value === "string" ? value : value.node;
        const [attr, filter] = getFilterForAttribute(filters, cat);
        return {
          ...filters,
          [attr]: filter.filter((val) => val != filterVal),
        };
      });
    },
    [setFilters],
  );

  const onChipGroupDelete = useCallback(
    (category: string | ToolbarChipGroup) => {
      setFilters((filters) => {
        const cat: FilterAttribute = (
          typeof category === "string" ? category : category.name
        ) as FilterAttribute;
        const [attr, _] = getFilterForAttribute(filters, cat);
        return {
          ...filters,
          [attr]: [],
        };
      });
    },
    [setFilters],
  );

  const clearAllFilters = useCallback(
    () =>
      setFilters({
        usernames: [],
        lastnames: [],
        firstnames: [],
        emails: [],
      }),
    [setFilters],
  );

  const inviteClient = useCallback(
    async (clientUsrname: string) => {
      const appointmentId = await createAppointment(clientUsrname);
      router.push(`/staff/appointments/id/${appointmentId}`);
    },
    [router],
  );

  const toggle = useMemo(
    () => (toggleRef: React.Ref<MenuToggleElement>) => (
      <MenuToggle
        ref={toggleRef}
        onClick={() => setIsOpen((isOpen) => !isOpen)}
        isExpanded={isOpen}
      >
        {filterAttr}
      </MenuToggle>
    ),
    [setIsOpen, isOpen, filterAttr],
  );

  const attributeDropdown = useMemo(
    () => (
      <Select
        id="single-select"
        isOpen={isOpen}
        selected={filterAttr}
        onSelect={(
          _event: React.MouseEvent<Element, MouseEvent> | undefined,
          value: string | number | undefined,
        ) => {
          if (!value) {
            return;
          }
          setFilterAttr(`${value}` as FilterAttribute);
          setIsOpen(false);
        }}
        onOpenChange={setIsOpen}
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
    ),
    [isOpen, filterAttr, setFilterAttr, setIsOpen, toggle],
  );

  const toolbar = useMemo(
    () => (
      <Toolbar clearAllFilters={clearAllFilters}>
        <ToolbarContent>
          <ToolbarGroup variant="filter-group">
            <ToolbarItem>{attributeDropdown}</ToolbarItem>
            <ToolbarItem>
              <AttributeFilter
                show={filterAttr === "Username"}
                displayValues={filters.usernames}
                inputValue={searchInput}
                onInputChange={setSearchInput}
                category={"Username"}
                onChipDelete={onChipDelete}
                onChipGroupDelete={onChipGroupDelete}
              />
              <AttributeFilter
                show={filterAttr === "First name"}
                displayValues={filters.firstnames}
                inputValue={searchInput}
                onInputChange={setSearchInput}
                category={"First name"}
                onChipDelete={onChipDelete}
                onChipGroupDelete={onChipGroupDelete}
              />
              <AttributeFilter
                show={filterAttr === "Last name"}
                displayValues={filters.lastnames}
                inputValue={searchInput}
                onInputChange={setSearchInput}
                category={"Last name"}
                onChipDelete={onChipDelete}
                onChipGroupDelete={onChipGroupDelete}
              />
              <AttributeFilter
                show={filterAttr === "Email"}
                displayValues={filters.emails}
                inputValue={searchInput}
                onInputChange={setSearchInput}
                category={"Email"}
                onChipDelete={onChipDelete}
                onChipGroupDelete={onChipGroupDelete}
              />
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarItem>
            <Button onClick={onSearch}>Search</Button>
          </ToolbarItem>
          <ToolbarItem variant="separator" />
          <ToolbarItem>
            <Tooltip content={"Refresh the list"}>
              <Button variant="plain" aria-label="sync" onClick={refreshList}>
                <SyncIcon />
              </Button>
            </Tooltip>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
    ),
    [
      attributeDropdown,
      filterAttr,
      searchInput,
      filters,
      setSearchInput,
      refreshList,
      onSearch,
      onChipDelete,
      onChipGroupDelete,
    ],
  );

  return (
    <Card style={{ width: "100%" }}>
      <CardTitle title="h1">New Appointment</CardTitle>
      <CardBody>
        {toolbar}
        {isMutating ? (
          <Bullseye>
            <Spinner />
          </Bullseye>
        ) : error ? (
          <ErrorView
            title={"Failed to retrieve the list of registered clients"}
            message={error.message}
            retry={() => refreshList()}
          />
        ) : (
          <ClientTable
            clients={clients}
            variant="compact"
            borders={false}
            actions={[
              {
                title: "Create Appointment",
                actionCallback: (_event, _idx, client) => {
                  inviteClient(client.username);
                },
              },
            ]}
          />
        )}
      </CardBody>
    </Card>
  );
};
