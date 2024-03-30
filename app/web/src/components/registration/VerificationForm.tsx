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
  FormHelperText,
  InputGroup,
  InputGroupItem,
  Divider,
  Popover,
  handleArrows,
} from "@patternfly/react-core";
import HelpIcon from "@patternfly/react-icons/dist/esm/icons/help-icon";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import ExclamationTriangleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon";
import CheckCircleIcon from "@patternfly/react-icons/dist/esm/icons/check-circle-icon";
import { Stylesheet } from "@lib/utils";
import { signOut } from "next-auth/react";
import LoadingButton from "@components/form/LoadingButton";
import EyeIcon from "@patternfly/react-icons/dist/esm/icons/eye-icon";
import EyeSlashIcon from "@patternfly/react-icons/dist/esm/icons/eye-slash-icon";
import { PasswordStrengthDemo } from "./PasswordInputForm";

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

  return (
    <Card className="verificationForm" style={styles.card}>
      <CardTitle component="h1" style={styles.titleHeading}>
        CHANGE PASSWORD
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
                  placeholder="Confirm Password"
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
              <LoadingButton onClick={onVerifyButtonClick}>
                Change password
              </LoadingButton>
            </ActionListItem>
          </ActionList>
        </Form>
      </CardBody>
    </Card>
  );
};

const styles: Stylesheet = {
  main: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  titleHeading: {
    fontSize: "30px",
    fontWeight: "700",
    textAlign: "center",
    color: "var(--pf-v5-global--primary-color--500)",
  },

  card: {
    width: "100vh",
    position: "relative",
    marginBottom: "7em",
    textAlign: "center",
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
