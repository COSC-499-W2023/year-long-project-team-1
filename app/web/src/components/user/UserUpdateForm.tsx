"use client"
import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  TextInput,
  Button,
  ActionList,
  ActionListItem,
} from "@patternfly/react-core";
import { User } from "@prisma/client";
import Link from "next/link";

interface UserUpdateFormProps {
  user: User;
}

const UserUpdateForm: React.FC<UserUpdateFormProps> = ({ user }: UserUpdateFormProps) => {
  const [showHelperText, setShowHelperText] = useState(false);
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const handleFirstNameChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setFirstName(value);
  };

  const handleLastNameChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setLastName(value);
  };
  const handleEmailChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setEmail(value);
  };

  return (
    <Card className="updateForm">
      <CardTitle component="h1">Update Account</CardTitle>
      <CardBody>
        {showHelperText && (
          <div>Error: Please fill out all fields.</div>
        )}
        <TextInput
          aria-label="firstName"
          name="firstName"
          placeholder={user.firstname}
          onChange={handleFirstNameChange}
        />
        <TextInput
          aria-label="lastName"
          name="lastName"
          placeholder={user.lastname}
          onChange={handleLastNameChange}
        />
        <TextInput
          aria-label="email"
          name="email"
          placeholder={user.email}
          onChange={handleLastNameChange}
        />
        <ActionList>
          <ActionListItem>
            {/* <Button onClick={onUpdateButtonClick}>Update Account</Button> */}
          </ActionListItem>
        </ActionList>
      </CardBody>
    </Card>
  );
};

export default UserUpdateForm;
