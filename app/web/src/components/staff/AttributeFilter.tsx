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
import { SearchInput, ToolbarFilter } from "@patternfly/react-core";

interface Props {
  display: boolean;
  valueDisplayed: string;
  onChange: (value: string) => void;
  category: string;
}
export const AttributeFilter = ({
  display,
  valueDisplayed,
  category,
  onChange,
}: Props) => {
  return (
    <ToolbarFilter
      chips={valueDisplayed !== "" ? [valueDisplayed] : ([] as string[])}
      deleteChip={() => onChange("")}
      deleteChipGroup={() => onChange("")}
      categoryName={category}
      showToolbarItem={display}
    >
      <SearchInput
        placeholder={"Filter by " + category}
        value={valueDisplayed}
        onChange={(_event, value) => onChange(value)}
        onClear={() => onChange("")}
      />
    </ToolbarFilter>
  );
};
