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
  InputGroup,
  InputGroupItem,
  Divider,
  Popover,
  PopoverPosition,
  CardFooter,
} from "@patternfly/react-core";
import HelpIcon from "@patternfly/react-icons/dist/esm/icons/help-icon";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import { Stylesheet } from "@lib/utils";
import { signOut } from "next-auth/react";
import LoadingButton from "@components/form/LoadingButton";
import EyeIcon from "@patternfly/react-icons/dist/esm/icons/eye-icon";
import EyeSlashIcon from "@patternfly/react-icons/dist/esm/icons/eye-slash-icon";
import { PasswordStrengthDemo } from "./PasswordInputForm";
import { QuestionCircleIcon } from "@patternfly/react-icons";
import Link from "next/link";

interface NewClientInfo {
  username: string;
  firstName: string;
  lastName: string;
  newPassword: string;
}

export interface VerificationFormProps {
  username: string;
}

export const VerificationForm: React.FunctionComponent<
  VerificationFormProps
> = ({ username }) => {
  const [showHelperText, setShowHelperText] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(true);
  const [loading, setIsLoading] = useState(false);
  const [passwordHidden, setPasswordHidden] = React.useState<boolean>(true);

  const verifyUserWithCognito = async (info: NewClientInfo) => {
    return await fetch("/api/auth/verifyUser", {
      method: "POST",
      body: JSON.stringify(info),
    }).then((res) => res.status);
  };

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

  const handlePasswordChange = (value: string) => {
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
      !firstName || !lastName || !password || !confirmPassword;
    setIsLoading(true);
    setIsValidPassword(!!password);
    setIsValidConfirmPassword(password === confirmPassword);
    setShowHelperText(needHelperText);

    // Check for password match
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      setIsLoading(false);
      return;
    } else {
      setPasswordMismatch(false);
    }

    // skip checks if not enough info
    if (needHelperText || passwordMismatch) {
      setIsLoading(false);
      return;
    }

    try {
      // Call cognito to update new password
      const status = await verifyUserWithCognito({
        firstName: firstName,
        lastName: lastName,
        newPassword: password,
        username: username,
      });
      if (status == 200) {
        alert(
          "Password is successfully updated! Please log in again with the new password.",
        );
        await signOut({ callbackUrl: "/api/auth/logout" });
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
  const backToLogin = (
    <>
      <Link href="/login">Back to login</Link>
    </>
  );

  return (
    <Card className="verificationForm" style={styles.card}>
      <CardTitle component="h1" style={styles.titleHeading}>
        Register new account{" "}
      </CardTitle>
      <Divider />
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
        <Form style={styles.form}>
          <FormGroup label="Username" disabled style={styles.formGroup}>
            <InputGroup>
              <InputGroupItem isFill>
                <TextInput
                  value={username}
                  type="text"
                  aria-label="disabled text input example"
                  isDisabled
                />
              </InputGroupItem>
              <InputGroupItem>
                <Popover
                  aria-label="popover example"
                  position={PopoverPosition.top}
                  bodyContent="This username is provided by the professional and cannot be changed."
                >
                  <Button variant="plain" aria-label="popover for input">
                    <QuestionCircleIcon />
                  </Button>
                </Popover>
              </InputGroupItem>
            </InputGroup>
          </FormGroup>
          <FormGroup
            label="First Name"
            isRequired
            fieldId="verification-form-firstname"
            style={styles.formGroup}
          >
            <TextInput
              aria-label="firstName"
              name="firstName"
              value={firstName}
              type="text"
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
              type="text"
              value={lastName}
              onChange={handleLastNameChange}
              isRequired
              className="verification_lastName_input"
              data-ouia-component-id="verification_lastName_input"
            />
          </FormGroup>
          <PasswordStrengthDemo
            initialValue={password}
            onChange={handlePasswordChange}
          />

          <FormGroup
            label="Confirm New Password"
            isRequired
            fieldId="verification-form-confirmpassword"
            style={styles.formGroup}
          >
            <InputGroup>
              <InputGroupItem isFill>
                <TextInput
                  aria-label="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  isRequired
                  type={passwordHidden ? "password" : "text"}
                  validated={
                    isValidConfirmPassword
                      ? ValidatedOptions.default
                      : ValidatedOptions.error
                  }
                  className="verification_confirmPassword_input"
                  data-ouia-component-id="verification_confirmPassword_input"
                />
              </InputGroupItem>
              <InputGroupItem>
                <Button
                  variant="control"
                  onClick={() => setPasswordHidden(!passwordHidden)}
                  aria-label={
                    passwordHidden ? "Show password" : "Hide password"
                  }
                >
                  {passwordHidden ? <EyeIcon /> : <EyeSlashIcon />}
                </Button>
              </InputGroupItem>
            </InputGroup>
          </FormGroup>
          <ActionList style={styles.actionList}>
            <ActionListItem style={styles.actionListItem}>
              <LoadingButton
                onClick={onVerifyButtonClick}
                style={styles.button}
              >
                Sign up{" "}
              </LoadingButton>
            </ActionListItem>
          </ActionList>
        </Form>
      </CardBody>
      <Divider />
      <CardFooter style={styles.cardFooterStyle}>{backToLogin}</CardFooter>
    </Card>
  );
};

const styles: Stylesheet = {
  main: {
    display: "flex",
    justifyContent: "center",
  },
  titleHeading: {
    fontSize: "30px",
    color: "rgba(0, 0, 0)",
    marginLeft: "1rem",
  },

  card: {
    width: "100vh",
    position: "relative",
    margin: "0 auto",
    boxShadow: "1px 6px 20px rgba(0, 0, 0, 0.1)",
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
    padding: "2rem 0rem 1rem 0rem",
    width: "100%",
  },
  actionListItem: {
    width: "100%",
    listStyleType: "none",
  },
  button: {
    width: "100%",
  },
  formGroup: {
    width: "100%",
    textAlign: "left",
    paddingLeft: "1rem",
    paddingRight: "1rem",
  },
  form: {
    height: "100%",
    width: "100%",
  },
  cardFooterStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
