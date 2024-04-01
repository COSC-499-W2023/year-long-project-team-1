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
import {
  SearchInput,
  ToolbarFilter,
  ToolbarFilterProps,
} from "@patternfly/react-core";

interface AttributeFilterProps {
  show: boolean;
  displayValues: string[];
  inputValue: string;
  onChipDelete: ToolbarFilterProps["deleteChip"];
  onChipGroupDelete: ToolbarFilterProps["deleteChipGroup"];
  onInputChange: (value: string) => void;
  category: string;
}
export const AttributeFilter = ({
  show,
  displayValues,
  inputValue,
  category,
  onInputChange,
  onChipDelete,
  onChipGroupDelete,
}: AttributeFilterProps) => {
  return (
    <ToolbarFilter
      chips={displayValues}
      deleteChip={onChipDelete}
      deleteChipGroup={onChipGroupDelete}
      categoryName={category}
      showToolbarItem={show}
    >
      <SearchInput
        placeholder={"Filter by " + category}
        value={inputValue}
        onChange={(_event, value) => onInputChange(value)}
        onClear={() => onInputChange("")}
      />
    </ToolbarFilter>
  );
};
