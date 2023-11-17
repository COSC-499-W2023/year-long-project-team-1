/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */

import {
    DataList,
    DataListItem,
    DataListItemRow,
    DataListItemCells,
    DataListCell,
    Title,
} from "@patternfly/react-core";

interface PrivacyPalDataListProps<T extends Record<string, any>> {
    data: T[];
    headings: string[];
}

export const PrivacyPalDataList = <T extends Record<string, any>>({ data, headings }: PrivacyPalDataListProps<T>) => {
    const headingCells = headings.map((heading, index) => {
        return (
            <DataListCell key={heading + index}>
                <Title headingLevel="h4">{heading}</Title>
            </DataListCell>
        );
    });

    const dataRows = data.map((row, rowIndex) => {
        const key = Object.keys(row)[0];
        const cells = [
            <DataListCell>{key.toString()}</DataListCell>,
            <DataListCell>{row[key].toString()}</DataListCell>,
        ];

        return (
            <DataListItem>
                <DataListItemRow key={key + rowIndex}>
                    <DataListItemCells dataListCells={cells} />
                </DataListItemRow>
            </DataListItem>
        );
    });

    return (
        <DataList aria-label="PrivacyPal data list" isCompact>
            <DataListItem aria-labelledby="data-list-headings">
                <DataListItemRow>
                    <DataListItemCells dataListCells={headingCells} />
                </DataListItemRow>
            </DataListItem>
            {dataRows}
        </DataList>
    );
};
