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
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
} from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";
import {
  ActionsColumn,
  Caption,
  IAction,
  Table,
  TableProps,
  Tbody,
  Td,
  Th,
  ThProps,
  Thead,
  Tr,
} from "@patternfly/react-table";
import React from "react";
import { useMemo } from "react";

export interface ClientInfo {
  username: string;
  email: string;
  lastName: string;
  firstName: string;
}

export const getSortableValueFrom = (client: ClientInfo): string[] => {
  return [client.username, client.email, client.lastName, client.firstName];
};

export type ClientActionFn = (
  event: React.MouseEvent<Element, MouseEvent>,
  rowIndex: number,
  client: ClientInfo,
) => void;

export interface ClientTableProps extends Omit<TableProps, "ref"> {
  clients: ClientInfo[];
  actions?: (Omit<IAction, "onClick"> & { actionCallback: ClientActionFn })[];
  caption?: string;
}

export const headers = ["Username", "Email", "Last Name", "First Name"];

export const ClientTable = ({
  clients,
  actions,
  caption = "Table of registered clients",
  ...others
}: ClientTableProps) => {
  const [activeSortIndex, setActiveSortIndex] = React.useState<
    number | undefined
  >();
  const [activeSortDirection, setActiveSortDirection] = React.useState<
    "asc" | "desc" | undefined
  >();

  const getSortParams = React.useCallback(
    (columnIndex: number): ThProps["sort"] => ({
      sortBy: {
        index: activeSortIndex,
        direction: activeSortDirection,
        defaultDirection: "asc", // starting sort direction when first sorting a column. Defaults to 'asc'
      },
      onSort: (_event, index, direction) => {
        setActiveSortIndex(index);
        setActiveSortDirection(direction);
      },
      columnIndex,
    }),
    [activeSortIndex, activeSortDirection],
  );

  const headingCells = useMemo(
    () =>
      headers.map((heading, idx) => {
        return (
          <Th sort={getSortParams(idx)} key={heading + idx}>
            {heading}
          </Th>
        );
      }),
    [getSortParams],
  );

  const sortedClients = React.useMemo(() => {
    if (activeSortIndex != undefined) {
      return [...clients].sort((a, b) => {
        const valueA = getSortableValueFrom(a)[activeSortIndex];
        const valueB = getSortableValueFrom(b)[activeSortIndex];
        return activeSortDirection == "desc"
          ? valueB.localeCompare(valueA)
          : valueA.localeCompare(valueB);
      });
    }
    return clients;
  }, [clients, activeSortDirection, activeSortIndex]);

  const rows = useMemo(
    () =>
      sortedClients.map((client) => {
        const { username, firstName, lastName, email } = client;
        return (
          <Tr key={username}>
            <Td dataLabel={username}>{username}</Td>
            <Td dataLabel={email}>{email}</Td>
            <Td dataLabel={lastName}>{lastName}</Td>
            <Td dataLabel={firstName}>{firstName}</Td>
            {!actions ? null : (
              <Td isActionCell>
                <ActionsColumn
                  items={actions.map((action) => ({
                    ...action,
                    onClick(event, rowIndex, _rowData, _extraData) {
                      action.actionCallback(event, rowIndex, client);
                    },
                  }))}
                />
              </Td>
            )}
          </Tr>
        );
      }),
    [sortedClients, actions],
  );

  return (
    <>
      <Table aria-label={caption} {...others}>
        <Caption>{caption}</Caption>
        <Thead>
          <Tr>{headingCells}</Tr>
        </Thead>
        <Tbody>
          {!rows ? (
            <Tr>
              <Td colSpan={8}>
                <Bullseye>
                  <EmptyState variant={EmptyStateVariant.sm}>
                    <EmptyStateHeader
                      icon={<EmptyStateIcon icon={SearchIcon} />}
                      titleText="No results found"
                      headingLevel="h2"
                    />
                    <EmptyStateBody>
                      Clear all filters and try again.
                    </EmptyStateBody>
                  </EmptyState>
                </Bullseye>
              </Td>
            </Tr>
          ) : (
            rows
          )}
        </Tbody>
      </Table>
    </>
  );
};
