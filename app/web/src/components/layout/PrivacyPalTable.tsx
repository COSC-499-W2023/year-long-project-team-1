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

import { Title } from "@patternfly/react-core";
import { Caption, Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

interface PrivacyPalTableProps<T extends Record<string, any>> {
    data: T[];
    headings: string[];
    caption?: string;
}

export const PrivacyPalTable = <T extends Record<string, any>>({
    data,
    headings,
    caption,
}: PrivacyPalTableProps<T>) => {
    const headingCells = headings.map((heading, index) => {
        return (
            <Th key={heading + index}>
                <Title headingLevel="h4">{heading}</Title>
            </Th>
        );
    });

    const rows = data.map((row, rowIndex) => {
        const rowData: string[] = [];
        const cells = Object.keys(row).map((key, cellIndex) => {
            rowData.push(row[key]);
            return <Td key={key + cellIndex}>{row[key]}</Td>;
        });

        return <Tr key={rowData.join("") + rowIndex}>{cells}</Tr>;
    });

    return (
        <>
            <Table
                aria-label={`Table of ${data[0] ? typeof data[0] : "unknown"} data`}
                variant={"compact"}
                borders={false}>
                {caption ? <Caption>{caption}</Caption> : null}
                <Thead>
                    <Tr>{headingCells}</Tr>
                </Thead>
                <Tbody>{rows}</Tbody>
            </Table>
        </>
    );
};
