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
import React, { useState } from "react";
import {
  Form,
  FormGroup,
  TextInput,
  Button,
  HelperText,
  HelperTextItem,
  FormHelperText,
  Card,
  CardBody,
  CardTitle,
  ActionList,
  ActionListItem,
  DatePicker,
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import Link from "next/link";
import { Session } from "next-auth";

interface UserUpdateFormProps {
  user: Session["user"];
}

const styles: {
  main: React.CSSProperties;
  titleHeading: React.CSSProperties;
  card: React.CSSProperties;
  cardBody: React.CSSProperties;
  actionList: React.CSSProperties;
  actionListItem: React.CSSProperties;
  formGroup: React.CSSProperties;
  form: React.CSSProperties;
} = {
  main: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  titleHeading: {
    fontSize: "30px",
    fontWeight: "700",
  },
  card: {
    width: "100vh",
    position: "relative",
    marginBottom: "7em",
    textAlign: "center",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    alignItems: "center",
  },
  actionList: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: "1rem",
  },
  actionListItem: {
    listStyleType: "none",
  },
  formGroup: {
    width: "100%",
    textAlign: "left",
  },
  form: {
    height: "100%",
    width: "100%",
  },
};

const UserUpdateForm: React.FC<UserUpdateFormProps> = ({ user }) => {
  const [showHelperText, setShowHelperText] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [mailingAddress, setMailingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setIsLoading] = useState(false);

  const handleFirstNameChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setFirstName(value);
  };

  const handleLastNameChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setLastName(value);
  };

  const handleBirthdateChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setBirthdate(value);
  };

  const handleMailingAddressChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setMailingAddress(value);
  };

  const handlePhoneNumberChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setPhoneNumber(value);
  };

  const onUpdateButtonClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    const missingFields =
      !firstName && !lastName && !birthdate && !mailingAddress && !phoneNumber;
    setIsLoading(true);
    setShowHelperText(missingFields);

    if (missingFields) {
      alert("Please fill out at least one field.");
      return;
    }

    try {
      // Perform update logic here
      alert("Update logic would go here.");
    } catch (error: any) {
      console.error("An unexpected error happened:", error);
      // Provide more specific error feedback to the user if needed
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUpdateButtonClick(
      event as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>,
    );
  };

  return (
    <Card className="userUpdateForm" style={styles.card}>
      <CardTitle component="h1" style={styles.titleHeading}>
        Update Information
      </CardTitle>
      <CardBody style={styles.cardBody}>
        {showHelperText && (
          <>
            <HelperText>
              <HelperTextItem
                variant="error"
                hasIcon
                icon={<ExclamationCircleIcon />}
              >
                Please fill out at least one field.
              </HelperTextItem>
            </HelperText>
          </>
        )}
        <Form isHorizontal style={styles.form} onSubmit={handleSubmit}>
          <FormGroup
            label="Email"
            fieldId="update-form-email"
            style={styles.formGroup}
          >
            <TextInput
              aria-label="email"
              type="email"
              id="update-form-name"
              name="update-form-email"
              placeholder={user.email}
              isDisabled
            />
          </FormGroup>
          <FormGroup
            label="First name"
            fieldId="update-form-firstname"
            style={styles.formGroup}
          >
            <TextInput
              aria-label="update-form-firstname"
              type="text"
              id="update-form-firstname"
              name="firstname"
              placeholder={user.firstName}
              onChange={handleFirstNameChange}
            />
          </FormGroup>
          <FormGroup
            label="Last name"
            fieldId="update-form-lastname"
            style={styles.formGroup}
          >
            <TextInput
              aria-label="update-form-lastname"
              type="text"
              id="update-form-lastname"
              name="lastname"
              placeholder={user.lastName}
              onChange={handleLastNameChange}
            />
          </FormGroup>
          <FormGroup
            label="Date Of Birth"
            fieldId="update-form-birthdate"
            style={styles.formGroup}
          >
            <DatePicker
              aria-label="update-form-birthdate"
              name="birthdate"
              placeholder="Date Of Birth"
              onChange={handleBirthdateChange}
            />
          </FormGroup>
          <FormGroup
            label="Mailing Address"
            fieldId="update-form-mallingaddress"
            style={styles.formGroup}
          >
            <TextInput
              aria-label="update-form-mailingaddress"
              name="mailingAddress"
              type="text"
              placeholder="Mailing Address"
              onChange={handleMailingAddressChange}
            />
          </FormGroup>
          <FormGroup
            label="Phone Number"
            fieldId="update-form-phonenumber"
            style={styles.formGroup}
          >
            <TextInput
              aria-label="update-form-phonenumber"
              name="phonenumber"
              placeholder={"Phone Number"}
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />
          </FormGroup>
          <ActionList style={styles.actionList}>
            <ActionListItem style={styles.actionListItem}>
              <Button type="submit">Submit</Button>
            </ActionListItem>
          </ActionList>
          <Link href="/user/change_password">Change your password</Link>
        </Form>
      </CardBody>
    </Card>
  );
};

export default UserUpdateForm;
