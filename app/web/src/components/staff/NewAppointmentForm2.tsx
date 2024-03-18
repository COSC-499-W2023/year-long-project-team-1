"use client";
import { PrivacyPalTable } from "@components/layout/PrivacyPalTable";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { User } from "next-auth";
import React from "react";
import { AttributeFilter } from "./AttributeFilter";

export const NewAppointmentForm2 = ({
  professionalUser,
}: {
  professionalUser: User;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [filterAttr, setFilterAttr] = React.useState<string>("Username");
  const [username, setUsername] = React.useState("");
  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [userData, setUserData] = React.useState([]);

  const onSearch = async () => {
    await fetch(`/api/clients?username=${username}&firstName=${firstname}&lastName=${lastname}&email=${email}`).then(async(response)=>{
      if(response.ok){
        const json = await response.json();
        setUserData(json.data);
      }
    });
  };

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined,
  ) => {
    setFilterAttr(value as string);
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
      {filterAttr}
    </MenuToggle>
  );

  const attributeDropdown = (
    <Select
      id="single-select"
      isOpen={isOpen}
      selected={filterAttr}
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
  );

  const toolbar = (
    <Toolbar>
      <ToolbarContent>
        <ToolbarGroup variant="filter-group">
          <ToolbarItem>
            {attributeDropdown}
            <AttributeFilter display={filterAttr === "Username"} valueDisplayed={username} onChange={(value) => setUsername(value)} category={"Username"}/>
            <AttributeFilter display={filterAttr === "First name"} valueDisplayed={firstname} onChange={(value)=>setFirstname(value)} category={"First name"}/>
            <AttributeFilter display={filterAttr === "Last name"} valueDisplayed={lastname} onChange={(value)=>setLastname(value)} category={"Last name"}/>
            <AttributeFilter display={filterAttr === "Email"} valueDisplayed={email} onChange={(value)=>setEmail(value)} category={"Email"}/>
          </ToolbarItem>
          <ToolbarItem>
            <Button onClick={onSearch}>Search</Button>
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
  return (
    <Card style={{ maxWidth: "100%"}}>
      <CardTitle title="h1">New Appointment</CardTitle>
      <CardBody>
        {toolbar}
        <PrivacyPalTable data={userData} headings={["Username","Email","Phone number","Last name","First name"]}></PrivacyPalTable>
      </CardBody>
    </Card>
  );
};
