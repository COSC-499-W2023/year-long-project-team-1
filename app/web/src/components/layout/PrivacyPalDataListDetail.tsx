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
import React, { useState } from "react";
import {
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
  Title,
  Modal,
  Button,
} from "@patternfly/react-core";
import LinkButton from "@components/form/LinkButton";

interface PrivacyPalDataListProps<T extends Record<string, any>> {
  data: T[];
  headings: string[];
}

export const PrivacyPalDataList = <T extends Record<string, any>>({
  data,
  headings,
}: PrivacyPalDataListProps<T>) => {
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = (row: T) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRow(null);
    setIsModalOpen(false);
  };

  const headingCells = headings.map((heading, index) => (
    <DataListCell key={heading + index}>
      <Title headingLevel="h4" ouiaId={`heading-for-${heading}`}>
        {heading}
      </Title>
    </DataListCell>
  ));

  return (
    <React.Fragment>
      <DataList aria-label="PrivacyPal data list" isCompact>
        <DataListItem aria-labelledby="data-list-headings">
          <DataListItemRow>
            <DataListItemCells dataListCells={headingCells} />
          </DataListItemRow>
        </DataListItem>
        {data.map((row, rowIndex) => {
          const rowData: string[] = [];
          const cells = Object.keys(row).map((key, index) => {
            rowData.push(row[key]);
            return (
              <DataListCell key={rowIndex + key + index}>
                {row[key].toString()}
              </DataListCell>
            );
          });

          return (
            <DataListItem key={rowData.join("") + rowIndex}>
              <DataListItemRow>
                <DataListItemCells dataListCells={cells} />
              </DataListItemRow>
              <DataListItemRow>
                <DataListItemCells
                  dataListCells={[
                    <Button
                      key={`view-button-${rowIndex}`}
                      variant="link"
                      onClick={() => openModal(row)}
                    >
                      View details{" "}
                    </Button>,
                  ]}
                />
              </DataListItemRow>
            </DataListItem>
          );
        })}
      </DataList>

      <Modal title="Appointment" isOpen={isModalOpen} onClose={closeModal}>
        {selectedRow &&
          Object.keys(selectedRow).map((key, index) => (
            <p key={index}>{`${key}: ${selectedRow[key]}`}</p>
          ))}
        <Button variant="link" onClick={() => setIsModalOpen(false)}>
          Close
        </Button>
        <LinkButton href="/upload" label="Upload a video" />
      </Modal>
    </React.Fragment>
  );
};
