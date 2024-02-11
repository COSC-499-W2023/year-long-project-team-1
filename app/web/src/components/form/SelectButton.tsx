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
import React from "react";
import {
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  Checkbox,
} from "@patternfly/react-core";
import LinkButton from "@components/form/LinkButton";
import Link from "next/link";

export const SelectBasic: React.FunctionComponent = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>("Options");

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined,
  ) => {
    console.log("selected", value);

    setSelected(value as string);
    setIsOpen(false);
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggleClick}
      isExpanded={isOpen}
      style={{ height: "50%", width: "50%", marginBottom: "0" }}
    >
      {selected}
    </MenuToggle>
  );

  return (
    <React.Fragment>
      <Select
        id="single-select"
        isOpen={isOpen}
        selected={selected}
        onSelect={onSelect}
        onOpenChange={(isOpen) => setIsOpen(isOpen)}
        toggle={toggle}
        shouldFocusToggleOnSelect
      >
        <SelectList>
          <SelectOption value="">
            <Link href="/user/dashboard">Dashboard</Link>
          </SelectOption>
          <SelectOption value="">
            <Link href="/user/update">Edit profile</Link>
          </SelectOption>
          <SelectOption value="">
            <Link href="/logout">Log out</Link>
          </SelectOption>
        </SelectList>
      </Select>
    </React.Fragment>
  );
};
