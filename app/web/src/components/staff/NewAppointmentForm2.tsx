"use client";
import { PrivacyPalTable } from "@components/layout/PrivacyPalTable";
import {
  Card,
  CardBody,
  CardTitle,
  MenuToggle,
  MenuToggleElement,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { User } from "next-auth";
import React from "react";

export const NewAppointmentForm2 = ({
  professionalUser,
}: {
  professionalUser: User;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>("Username");
  const [value, setValue] = React.useState("");

  const onSearch = async () => {};

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined,
  ) => {
    // eslint-disable-next-line no-console
    console.log("selected", value);

    setSelected(value as string);
    setIsOpen(false);
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggleClick}
      isExpanded={isOpen}
      style={
        {
          width: "200px",
        } as React.CSSProperties
      }
    >
      {selected}
    </MenuToggle>
  );
  const toolbar = (
    <Toolbar>
      <ToolbarContent>
        <ToolbarItem>
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
              <SelectOption value="Username">Username</SelectOption>
              <SelectOption value="Email">Email</SelectOption>
              <SelectOption value="First name">First name</SelectOption>
              <SelectOption value="Last name">Last name</SelectOption>
            </SelectList>
          </Select>
        </ToolbarItem>
        <ToolbarItem>
          <SearchInput
            placeholder={"Find by " + selected}
            value={value}
            onChange={(_event, value) => setValue(value)}
            onSearch={(_event, value) => setValue(value)}
            onClear={() => setValue("")}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
  return (
    <Card style={{ maxWidth: "100%", minWidth: "40rem" }}>
      <CardTitle title="h1">New Appointment</CardTitle>
      <CardBody>
        {toolbar}
        <PrivacyPalTable data={[]} headings={[]}></PrivacyPalTable>
      </CardBody>
    </Card>
  );
};
