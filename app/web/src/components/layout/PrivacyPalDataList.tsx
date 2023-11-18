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
    const headingCells = headings.slice(0, 2).map((heading, index) => {
        return (
            <DataListCell key={heading + index}>
                <Title headingLevel="h4" ouiaId={`heading-for-${heading}`}>
                    {heading}
                </Title>
            </DataListCell>
        );
    });

    const dataRows = data.map((row, rowIndex) => {
        const rowData: string[] = [];

        const cells = Object.keys(row)
            .slice(0, 2)
            .map((key, index) => {
                rowData.push(row[key]);
                return <DataListCell key={rowIndex + key + index}>{row[key].toString()}</DataListCell>;
            });

        return (
            <DataListItem key={rowData.join("") + rowIndex}>
                <DataListItemRow>
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
