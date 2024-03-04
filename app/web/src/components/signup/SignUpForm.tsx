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
  DatePicker,
  Form,
  FormGroup,
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import Link from "next/link";
import { utf8ToBase64 } from "@lib/base64";
import { ImageFileUpload } from "./ImageFileUpload";
import { Stylesheet } from "@lib/utils";

export interface SignUpFormProps {}

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

export const SignUpForm: React.FunctionComponent<
  SignUpFormProps
> = ({}: SignUpFormProps) => {
  const [showHelperText, setShowHelperText] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [mailingAddress, setMailingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
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

  const handleEmailChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setEmail(value);
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

  const onSignUpButtonClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    const needHelperText =
      !firstName ||
      !lastName ||
      !email ||
      !birthdate ||
      !mailingAddress ||
      !phoneNumber ||
      !password ||
      !confirmPassword;
    setIsLoading(true);
    setIsValidEmail(!!email);
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
        // Perform signup logic here
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
    <Card className="signUpForm" style={styles.card}>
      <CardTitle component="h1" style={styles.titleHeading}>
        Sign Up
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
          <FormGroup
            label="First Name"
            isRequired
            fieldId="signup-form-firstname"
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
              className="signup_firstName_input"
              data-ouia-component-id="signup_firstName_input"
            />
          </FormGroup>
          <FormGroup
            label="Last Name"
            isRequired
            fieldId="signup-form-lastname"
            style={styles.formGroup}
          >
            <TextInput
              aria-label="lastName"
              name="lastName"
              placeholder="Last Name"
              value={lastName}
              onChange={handleLastNameChange}
              isRequired
              className="signup_lastName_input"
              data-ouia-component-id="signup_lastName_input"
            />
          </FormGroup>
          <FormGroup
            label="Email"
            isRequired
            fieldId="signup-form-email"
            style={styles.formGroup}
          >
            <TextInput
              aria-label="email"
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              isRequired
              validated={
                isValidEmail ? ValidatedOptions.default : ValidatedOptions.error
              }
              className="signup_email_input"
              data-ouia-component-id="signup_email_input"
            />
          </FormGroup>
          <FormGroup
            label="Date Of Birth"
            isRequired
            fieldId="signup-form-birthdate"
            style={styles.formGroup}
          >
            <DatePicker
              aria-label="birthdate"
              name="birthdate"
              placeholder="Date Of Birth"
              value={birthdate}
              onChange={handleBirthdateChange}
              required
              className="signup_birthdate_input"
              style={styles.datePicker}
              data-ouia-component-id="signup_birthdate_input"
            />
          </FormGroup>
          <FormGroup
            label="Mailing Address"
            isRequired
            fieldId="signup-form-mallingaddress"
            style={styles.formGroup}
          >
            <TextInput
              aria-label="mailingAddress"
              name="mailingAddress"
              placeholder="Mailing Address"
              value={mailingAddress}
              onChange={handleMailingAddressChange}
              isRequired
              className="signup_mailingAddress_input"
              data-ouia-component-id="signup_mailingAddress_input"
            />
          </FormGroup>
          <FormGroup
            label="Phone Number"
            isRequired
            fieldId="signup-form-phonenumber"
            style={styles.formGroup}
          >
            <TextInput
              aria-label="phoneNumber"
              name="phoneNumber"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              isRequired
              className="signup_phoneNumber_input"
              data-ouia-component-id="signup_phoneNumber_input"
            />
          </FormGroup>
          <FormGroup
            label="Enter Password"
            isRequired
            fieldId="signup-form-password"
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
              className="signup_password_input"
              data-ouia-component-id="signup_password_input"
            />
          </FormGroup>
          <FormGroup
            label="Confirm Password"
            isRequired
            fieldId="signup-form-confirmpassword"
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
              className="signup_confirmPassword_input"
              data-ouia-component-id="signup_confirmPassword_input"
            />
          </FormGroup>

          <div style={styles.imageFileUpload}>
            <ImageFileUpload />
          </div>
          <ActionList style={styles.actionList}>
            <ActionListItem style={styles.actionListItem}>
              <Button onClick={onSignUpButtonClick}>Sign Up</Button>
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
