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
  Dropdown,
  DropdownItem,
  DropdownList,
  Divider,
  MenuToggle,
  MenuToggleElement,
} from "@patternfly/react-core";
import EllipsisVIcon from "@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon";
import { useState } from "react";

/*
  This component is still just a template from PatternFly's documentation.
*/

export const ConversationDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined,
  ) => {
    // eslint-disable-next-line no-console
    console.log("selected", value);
    setIsOpen(false);
  };

  return (
    <Dropdown
      isOpen={isOpen}
      onSelect={onSelect}
      onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          aria-label="kebab dropdown toggle"
          variant="plain"
          onClick={onToggleClick}
          isExpanded={isOpen}
        >
          <EllipsisVIcon />
        </MenuToggle>
      )}
      shouldFocusToggleOnSelect
    >
      <DropdownList>
        <DropdownItem value={0} key="action">
          Action
        </DropdownItem>
        <DropdownItem
          value={1}
          key="link"
          to="#default-link2"
          // Prevent the default onClick functionality for example purposes
          onClick={(ev: any) => ev.preventDefault()}
        >
          Link
        </DropdownItem>
        <DropdownItem value={2} isDisabled key="disabled action">
          Disabled Action
        </DropdownItem>
        <DropdownItem
          value={3}
          isDisabled
          key="disabled link"
          to="#default-link4"
        >
          Disabled Link
        </DropdownItem>
        <Divider component="li" key="separator" />
        <DropdownItem value={4} key="separated action">
          Separated Action
        </DropdownItem>
        <DropdownItem
          value={5}
          key="separated link"
          to="#default-link6"
          onClick={(ev) => ev.preventDefault()}
        >
          Separated Link
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};
