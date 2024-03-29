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
  const [passwordHidden1, setPasswordHidden1] = React.useState<boolean>(true);
  const [passwordHidden2, setPasswordHidden2] = React.useState<boolean>(true);
  const PasswordStrengthDemo: React.FunctionComponent = () => {
    type HelperTextItemVariant =
      | "default"
      | "indeterminate"
      | "warning"
      | "success"
      | "error";

    interface PassStrength {
      variant: HelperTextItemVariant;
      icon: JSX.Element;
      text: string;
    }

    const [password, setPassword] = React.useState("");
    const [ruleLength, setRuleLength] =
      React.useState<HelperTextItemVariant>("indeterminate");
    const [ruleNumber, setRuleNumber] =
      React.useState<HelperTextItemVariant>("indeterminate");
    const [ruleSpecial, setRuleSpecial] =
      React.useState<HelperTextItemVariant>("indeterminate");
    const [ruleUpper, setRuleUpper] =
      React.useState<HelperTextItemVariant>("indeterminate");
    const [ruleLower, setRuleLower] =
      React.useState<HelperTextItemVariant>("indeterminate");
    const [passStrength, setPassStrength] = React.useState<PassStrength>({
      variant: "error",
      icon: <ExclamationCircleIcon />,
      text: "Weak",
    });
    const [passwordHidden, setPasswordHidden] = React.useState<boolean>(true);

    const handlePasswordInput = (_event: any, password: string) => {
      setPassword(password);
      validate(password);
    };

    const validate = (password: string) => {
      if (password === "") {
        setRuleLength("indeterminate");
        setRuleNumber("indeterminate");
        setRuleSpecial("indeterminate");
        setRuleUpper("indeterminate");
        setRuleLower("indeterminate");
        return;
      }
      if (password.length < 8) {
        setRuleLength("error");
      } else {
        setRuleLength("success");
      }

      let ruleNum = 0,
        ruleSpecial = 0,
        ruleUpper = 0,
        ruleLower = 0;
      let strCount = 0;
      //contains at least 1 lowercase letter
      if (/[a-z]/g.test(password)) {
        const lowercaseMatches = password.match(/[a-z]/g);
        if (lowercaseMatches !== null) {
          strCount += lowercaseMatches.length;
        }
        ruleLower++;
      }
      //contains at least 1 uppercase letter
      if (/[A-Z]/g.test(password)) {
        const uppercaseMatches = password.match(/[A-Z]/g);
        if (uppercaseMatches !== null) {
          strCount += uppercaseMatches.length;
        }
        ruleUpper++;
      }

      if (/\d/g.test(password)) {
        const numberMatches = password.match(/\d/g);
        if (numberMatches !== null) {
          strCount += numberMatches.length;
        }
        ruleNum++;
      }

      if (/\W/g.test(password)) {
        const specialMatches = password.match(/\W/g);
        if (specialMatches !== null) {
          strCount += specialMatches.length;
        }
        ruleSpecial++;
      }
      if (ruleNum == 0) {
        setRuleNumber("error");
      } else {
        setRuleNumber("success");
      }
      if (ruleSpecial == 0) {
        setRuleSpecial("error");
      } else {
        setRuleSpecial("success");
      }
      if (ruleUpper == 0) {
        setRuleUpper("error");
      } else {
        setRuleUpper("success");
      }
      if (ruleLower == 0) {
        setRuleLower("error");
      } else {
        setRuleLower("success");
      }

      if (strCount == 8) {
        setPassStrength({
          variant: "error",
          icon: <ExclamationCircleIcon />,
          text: "Weak",
        });
      } else if (strCount < 14) {
        setPassStrength({
          variant: "warning",
          icon: <ExclamationTriangleIcon />,
          text: "Medium",
        });
      } else {
        setPassStrength({
          variant: "success",
          icon: <CheckCircleIcon />,
          text: "Strong",
        });
      }
    };

    const iconPopover = (
      <Popover
        headerContent={<div>Password Requirements</div>}
        bodyContent={
          <div>
            <p style={{ color: "grey" }}>Password minimum length</p>
            <p>8 character(s).</p>
            <br />
            <p style={{ color: "grey" }}>Password requirements</p>
            <p>Contains at least 1 number.</p>
            <p>Contains at least 1 special character.</p>
            <p>Contains at least 1 uppercase letter.</p>
            <p>Contains at least 1 lowercase letter.</p>
          </div>
        }
      >
        <button
          type="button"
          aria-label="More info for name field"
          onClick={(e) => e.preventDefault()}
          aria-describedby="password-field"
          className="pf-v5-c-form__group-label-help"
        >
          <HelpIcon />
        </button>
      </Popover>
    );

    const passStrLabel = (
      <HelperText>
        <HelperTextItem variant={passStrength.variant} icon={passStrength.icon}>
          {passStrength.text}
        </HelperTextItem>
      </HelperText>
    );

    return (
      <FormGroup
        label="New Password"
        labelIcon={iconPopover}
        isRequired
        fieldId="password-field"
        {...(ruleLength === "success" &&
          ruleNumber === "success" &&
          ruleSpecial === "success" &&
          ruleLower === "success" &&
          ruleUpper === "success" && {
            labelInfo: passStrLabel,
          })}
      >
        <InputGroup>
          <InputGroupItem isFill>
            <TextInput
              isRequired
              type={passwordHidden ? "password" : "text"}
              id="password-field"
              name="password-field"
              aria-describedby="password-field-helper"
              aria-invalid={
                ruleLength === "error" ||
                ruleNumber === "error" ||
                ruleSpecial === "error" ||
                ruleUpper === "error" ||
                ruleLower === "error"
              }
              value={password}
              onChange={handlePasswordInput}
              validated={
                isValidConfirmPassword
                  ? ValidatedOptions.default
                  : ValidatedOptions.error
              }
            />
          </InputGroupItem>
          <InputGroupItem>
            <Button
              variant="control"
              onClick={() => setPasswordHidden(!passwordHidden)}
              aria-label={passwordHidden ? "Show password" : "Hide password"}
            >
              {passwordHidden ? <EyeIcon /> : <EyeSlashIcon />}
            </Button>
          </InputGroupItem>
        </InputGroup>
        <FormHelperText>
          <HelperText
            component="ul"
            aria-live="polite"
            id="password-field-helper"
          >
            <HelperTextItem isDynamic variant={ruleLength} component="li">
              Must be at least 8 characters
            </HelperTextItem>
            <HelperTextItem isDynamic variant={ruleNumber} component="li">
              Must contain at least 1 number
            </HelperTextItem>
            <HelperTextItem isDynamic variant={ruleSpecial} component="li">
              Must contain at least 1 special character{" "}
            </HelperTextItem>
            <HelperTextItem isDynamic variant={ruleUpper} component="li">
              Must include at least 1 uppercase letter{" "}
            </HelperTextItem>
            <HelperTextItem isDynamic variant={ruleLower} component="li">
              Must include at least 1 lowercase letter{" "}
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>
    );
  };

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
    } else {
      setPasswordMismatch(false);
    }

    // skip checks if not enough info
    if (needHelperText || passwordMismatch) {
      return;
    }

    try {
      if (!needHelperText && !passwordMismatch) {
        // Call cognito to update new password
        const status = await verifyUserWithCognito({
          firstName: firstName,
          lastName: lastName,
          newPassword: password,
          username: username,
        });
        if (status == 200) {
          alert(
            "Password is successfully updated! Please log in again with new password.",
          );
          await signOut({ callbackUrl: "/api/auth/logout" });
        }
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
            {" "}
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
          <PasswordStrengthDemo />

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
                  type={passwordHidden2 ? "password" : "text"}
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
                  onClick={() => setPasswordHidden2(!passwordHidden2)}
                  aria-label={
                    passwordHidden2 ? "Show password" : "Hide password"
                  }
                >
                  {passwordHidden2 ? <EyeIcon /> : <EyeSlashIcon />}
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
