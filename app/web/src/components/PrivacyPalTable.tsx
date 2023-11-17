/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */
"use client";

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
        return <Th key={heading + index}>{heading}</Th>;
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
