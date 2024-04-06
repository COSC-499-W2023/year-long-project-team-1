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
  Divider,
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import { useRouter } from "next/navigation";
import { Stylesheet } from "@lib/utils";
import LoadingButton from "@components/form/LoadingButton";

const styles: Stylesheet = {
  main: {
    display: "flex",
    justifyContent: "center",
  },
  titleHeading: {
    fontSize: "30px",
    color: "rgba(0, 0, 0)",
  },
  card: {
    maxWidth: "100%",
    minWidth: "40rem",
    position: "relative",
    marginBottom: "7em",
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

export const RegistrationForm: React.FunctionComponent = () => {
  const router = useRouter();
  const [showHelperText, setShowHelperText] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [confirmation, setConfirmation] = useState("");
  const [loading, setIsLoading] = useState(false);

  const registerUser = async () => {
    return await fetch("/api/clients", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        email: email,
      }),
    }).then((res) => res.status);
  };

  const handleEmailChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setEmail(value);
  };

  const handleUsrnameChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setUsername(value);
  };

  const checkEmailPattern = (email: string) => {
    const regexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
    return regexp.test(email);
  };

  const onSignUpButtonClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    const needHelperText = !email || !checkEmailPattern(email);
    setIsLoading(true);
    setIsValidEmail(!!email);
    setShowHelperText(needHelperText);

    // skip checks if not enough info
    if (needHelperText) {
      return;
    }

    try {
      if (!needHelperText) {
        // Perform signup logic here
        const status = await registerUser();
        console.log("status", status);
        if (status == 200) {
          setConfirmation("User is successfully registered. ");
        } else {
          setConfirmation(
            "User couldn't be registered. Please check the information.",
          );
        }
      }
    } catch (error: any) {
      console.error("An unexpected error happened:", error);
      setShowHelperText(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="registerForm" style={styles.card}>
      <CardTitle component="h1" style={styles.titleHeading}>
        Invite new client
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
                {checkEmailPattern(email)
                  ? "Please fill out all fields."
                  : "Invalid email."}
              </HelperTextItem>
            </HelperText>
          </>
        ) : null}

        <Form style={styles.form}>
          <FormGroup
            label="Username"
            isRequired
            fieldId="signup-form-username"
            style={styles.formGroup}
          >
            <TextInput
              aria-label="Username"
              name="Username"
              placeholder="Client's username"
              value={username}
              onChange={handleUsrnameChange}
              isRequired
              className="signup_username_input"
              data-ouia-component-id="signup_username_input"
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
          {confirmation ? confirmation : null}
          <ActionList style={styles.actionList}>
            <ActionListItem style={styles.actionListItem}>
              <LoadingButton
                onClick={onSignUpButtonClick}
                style={styles.button}
              >
                Invite client
              </LoadingButton>
            </ActionListItem>
          </ActionList>
        </Form>
      </CardBody>
    </Card>
  );
};
