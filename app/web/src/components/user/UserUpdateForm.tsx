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
  Card,
  CardBody,
  CardTitle,
  ActionList,
  ActionListItem,
  ValidatedOptions,
  Alert,
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import Link from "next/link";
import { User } from "next-auth";
import { Stylesheet } from "@lib/utils";
import { AttributeType } from "@aws-sdk/client-cognito-identity-provider";
import { useSession } from "next-auth/react";

interface UserUpdateFormProps {
  user: User;
}

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
  },
  card: {
    width: "100vh",
    position: "relative",
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
              break;
            case "given_name":
              url += `firstName=${attribute["Value"]}&`;
              break;
            case "family_name":
              url += `lastName=${attribute["Value"]}&`;
              break;
            default:
              break;
          }
        }
        console.log(url.substring(0, url.length - 1));
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
        {statusMessage === "" ? null : (
          <Alert
            variant={isError ? "danger" : "success"}
            title={statusMessage}
          />
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
