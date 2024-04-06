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
import { AttributeType } from "@aws-sdk/client-cognito-identity-provider";
import { Stylesheet } from "@lib/utils";
import {
  ActionList,
  ActionListItem,
  Button,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  HelperText,
  HelperTextItem,
  TextInput,
  ValidatedOptions,
  Alert,
  Divider,
  CardFooter,
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import { User } from "next-auth";
import Link from "next/link";
import React, { useState } from "react";

interface UserUpdateFormProps {
  user: User;
}

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

const UserUpdateForm: React.FC<UserUpdateFormProps> = ({ user }) => {
  const [showHelperText, setShowHelperText] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailErrorState, setEmailErrorState] = useState(
    ValidatedOptions.default,
  );
  // used for status/error alert
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleEmailChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    // reset error status after 'bad email' message
    setIsError(false);
    setStatusMessage("");

    // validate new string using an absolutely inSANE regex string i found on stackoverflow:
    // https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
    if (
      value.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ) != null
    )
      setEmailErrorState(ValidatedOptions.success);
    else if (value.length === 0) setEmailErrorState(ValidatedOptions.default);
    else setEmailErrorState(ValidatedOptions.error);

    setEmail(value);
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
  const onUpdateButtonClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    const missingFields = !email && !firstName && !lastName;
    setShowHelperText(missingFields);
    if (missingFields) return;

    try {
      const attributes: AttributeType[] = [];

      if (email) {
        if (emailErrorState !== ValidatedOptions.success) {
          setIsError(true);
          setStatusMessage("Bad email format.");
          return;
        }

        attributes.push({
          Name: "email",
          Value: email,
        });

        // tell cognito that this is in fact a valid and authorized and verified email,
        // otherwise we'll get a 200 response when it actually failed to update
        attributes.push({
          Name: "email_verified",
          Value: "true",
        });
      }
      if (firstName) {
        attributes.push({
          Name: "given_name",
          Value: firstName,
        });
      }
      if (lastName) {
        attributes.push({
          Name: "family_name",
          Value: lastName,
        });
      }

      const formData = new FormData();
      formData.set("userAttributes", JSON.stringify(attributes));

      const response = await fetch("/api/update-info", {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        setIsError(false);
        setStatusMessage("Successfully updated info.");

        // success, so update the session information as well
        let url = "/api/auth/session?";
        for (const attribute of attributes) {
          const attributeName = attribute["Name"];
          switch (attributeName) {
            case "email":
              url += `email=${attribute["Value"]}&`;
              const emailField = document.getElementById(
                "update-form-email",
              ) as HTMLInputElement;
              emailField.placeholder = attribute["Value"] ?? user.email;
              emailField.value = "";
              setEmailErrorState(ValidatedOptions.default);
              break;
            case "given_name":
              url += `firstName=${attribute["Value"]}&`;
              const firstNameField = document.getElementById(
                "update-form-firstname",
              ) as HTMLInputElement;
              firstNameField.placeholder = attribute["Value"] ?? user.firstName;
              firstNameField.value = "";
              break;
            case "family_name":
              url += `lastName=${attribute["Value"]}&`;
              const lastNameField = document.getElementById(
                "update-form-lastname",
              ) as HTMLInputElement;
              lastNameField.placeholder = attribute["Value"] ?? user.lastName;
              lastNameField.value = "";
              break;
            default:
              break;
          }
        }
        await fetch(url.substring(0, url.length - 1)); // get rid of trailing '&'
      } else {
        setIsError(true);
        setStatusMessage("Failed to update info.");
      }
    } catch (error: any) {
      console.log("An unexpected error happened:", error);
      setIsError(true);
      setStatusMessage("Unknown and unexpected internal server error");
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUpdateButtonClick(
      event as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>,
    );
  };
  const changePassword = (
    <>
      <Link href="https://privacypal.auth.ca-central-1.amazoncognito.com/forgotPassword?client_id=7du2a5dvukpbmf851o8t9gffv4&response_type=code&scope=email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fcognito">
        Change your password
      </Link>
    </>
  );
  return (
    <Card className="userUpdateForm" style={styles.card}>
      <CardTitle component="h1" style={styles.titleHeading}>
        Update your information
      </CardTitle>
      <Divider />

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
        {statusMessage === "" ? null : (
          <Alert
            variant={isError ? "danger" : "success"}
            title={statusMessage}
          />
        )}
        <Form style={styles.form} onSubmit={handleSubmit}>
          <FormGroup
            label="Email"
            fieldId="update-form-email"
            style={styles.formGroup}
          >
            <TextInput
              aria-label="update-form-email"
              type="email"
              id="update-form-email"
              name="email"
              placeholder={user.email}
              validated={emailErrorState}
              onChange={handleEmailChange}
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
          <ActionList style={styles.actionList}>
            <ActionListItem style={styles.actionListItem}>
              <Button type="submit" style={styles.button}>
                Change information
              </Button>
            </ActionListItem>
          </ActionList>
        </Form>
      </CardBody>
      <Divider />
      <CardFooter style={styles.cardFooterStyle}>{changePassword}</CardFooter>
    </Card>
  );
};

export default UserUpdateForm;
