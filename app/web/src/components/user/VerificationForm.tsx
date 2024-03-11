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
  Card,
  CardBody,
  CardTitle,
  TextInput,
  Button,
  ValidatedOptions,
  HelperText,
  HelperTextItem,
  ActionList,
  ActionListItem,
  Form,
  FormGroup,
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import Link from "next/link";
import { Stylesheet } from "@lib/utils";

export interface VerificationFormProps {
  username?: string 
}

const styles: Stylesheet = {
  main: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  titleHeading: {
    fontSize: "50px",
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
  datePicker: {
    width: "100%",
  },
  imageFileUpload: {
    width: "100%",
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

export const VerificationForm: React.FunctionComponent<
  VerificationFormProps
> = ({username}) => {
  const [showHelperText, setShowHelperText] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(true);
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

  const handlePhoneNumberChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setPhoneNumber(value);
  };

  const handlePasswordChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setPassword(value);
  };

  const handleConfirmPasswordChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setConfirmPassword(value);
  };

  const onVerifyButtonClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    const needHelperText =
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !password ||
      !confirmPassword;
    setIsLoading(true);
    setIsValidPassword(!!password);
    setIsValidConfirmPassword(password === confirmPassword);
    setShowHelperText(needHelperText);

    // Check for password match
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }

    // skip checks if not enough info
    if (needHelperText || passwordMismatch) {
      return;
    }

    try {
      if (!needHelperText && !passwordMismatch) {
        // Perform password change logic here
        alert("Sign-up logic would go here.");
      }
    } catch (error: any) {
      console.error("An unexpected error happened:", error);
      setShowHelperText(true);
    } finally {
      setIsLoading(false);
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <Card className="verificationForm" style={styles.card}>
      <CardTitle component="h1" style={styles.titleHeading}>
        Change password
      </CardTitle>
      <CardBody style={styles.cardBody}>
        {showHelperText ? (
          <>
            <HelperText>
              <HelperTextItem
                variant="error"
                hasIcon
                icon={<ExclamationCircleIcon />}
              >
                Please fill out all fields.
              </HelperTextItem>
            </HelperText>
          </>
        ) : null}

        {passwordMismatch && (
          <HelperText>
            <HelperTextItem
              variant="error"
              hasIcon
              icon={<ExclamationCircleIcon />}
            >
              Password and Confirm Password must match.
            </HelperTextItem>
          </HelperText>
        )}
        <Form isHorizontal style={styles.form}>
          <FormGroup label="Username" disabled style={styles.formGroup}>
            {username}
          </FormGroup>
          <FormGroup
            label="First Name"
            isRequired
            fieldId="verification-form-firstname"
            style={styles.formGroup}
          >
            {" "}
            <TextInput
              aria-label="firstName"
              name="firstName"
              placeholder="First Name"
              value={firstName}
              onChange={handleFirstNameChange}
              isRequired
              className="verification_firstName_input"
              data-ouia-component-id="verification_firstName_input"
            />
          </FormGroup>
          <FormGroup
            label="Last Name"
            isRequired
            fieldId="verification-form-lastname"
            style={styles.formGroup}
          >
            <TextInput
              aria-label="lastName"
              name="lastName"
              placeholder="Last Name"
              value={lastName}
              onChange={handleLastNameChange}
              isRequired
              className="verification_lastName_input"
              data-ouia-component-id="verification_lastName_input"
            />
          </FormGroup>
          <FormGroup
            label="Phone Number"
            isRequired
            fieldId="verification-form-phonenumber"
            style={styles.formGroup}
          >
            <TextInput
              aria-label="phoneNumber"
              name="phoneNumber"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              isRequired
              className="verification_phoneNumber_input"
              data-ouia-component-id="verification_phoneNumber_input"
            />
          </FormGroup>
          <FormGroup
            label="Enter Password"
            isRequired
            fieldId="verification-form-password"
            style={styles.formGroup}
          >
            <TextInput
              aria-label="password"
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              isRequired
              validated={
                isValidPassword
                  ? ValidatedOptions.default
                  : ValidatedOptions.error
              }
              className="verification_password_input"
              data-ouia-component-id="verification_password_input"
            />
          </FormGroup>
          <FormGroup
            label="Confirm Password"
            isRequired
            fieldId="verification-form-confirmpassword"
            style={styles.formGroup}
          >
            <TextInput
              aria-label="confirmPassword"
              placeholder="Confirm Password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              isRequired
              validated={
                isValidConfirmPassword
                  ? ValidatedOptions.default
                  : ValidatedOptions.error
              }
              className="verification_confirmPassword_input"
              data-ouia-component-id="verification_confirmPassword_input"
            />
          </FormGroup>
          <ActionList style={styles.actionList}>
            <ActionListItem style={styles.actionListItem}>
              <Button onClick={onVerifyButtonClick}>Sign Up</Button>
            </ActionListItem>
            <ActionListItem style={styles.actionListItem}>
              <Link href="login">
                <Button>Back to Login</Button>
              </Link>
            </ActionListItem>
          </ActionList>
        </Form>
      </CardBody>
    </Card>
  );
};
