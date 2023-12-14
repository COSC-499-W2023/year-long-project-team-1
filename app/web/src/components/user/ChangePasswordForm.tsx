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
import React from "react";
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
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";

const styles: {
  main: React.CSSProperties;
  title: React.CSSProperties;
} = {
  main: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
  },
  title: {
    textAlign: "center",
    fontSize: "30px",
    fontWeight: "700",
  },
};

export interface ChangePasswordFormProps {
  redirectUrl?: string;
}

const ChangePasswordForm: React.FunctionComponent<ChangePasswordFormProps> = ({
  redirectUrl,
}: ChangePasswordFormProps) => {
  const [showHelperText, setShowHelperText] = React.useState(false);
  const [currentpassword, setCurrentPassword] = React.useState("");
  const [newpassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
  const [isValidPassword, setIsValidPassword] = React.useState(true);
  const [loading, setIsLoading] = React.useState(false);

  const handleCurrentPasswordChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setCurrentPassword(value);
  };

  const handleNewPasswordChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setNewPassword(value);
  };

  const handleConfirmNewPasswordChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setConfirmNewPassword(value);
  };

  return (
    <Card>
      <CardBody style={styles.main}>
        <CardTitle component="h1" style={styles.title}>
          Change Your Password
        </CardTitle>
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
        <TextInput
          aria-label="update-currentpassword"
          name="update-currentpassword"
          placeholder="Current Password"
          value={currentpassword}
          onChange={handleCurrentPasswordChange}
          isRequired
          validated={
            isValidPassword ? ValidatedOptions.default : ValidatedOptions.error
          }
          className="update_currentpassword_input"
        />
        <TextInput
          aria-label="update-newpassword"
          placeholder="New Password"
          name="update-newpassword"
          type="password"
          value={newpassword}
          onChange={handleNewPasswordChange}
          isRequired
          validated={
            isValidPassword ? ValidatedOptions.default : ValidatedOptions.error
          }
          className="update_newpassword_input"
        />
        <TextInput
          aria-label="update-confirmnewpassword"
          placeholder="Confirm New Password"
          name="update-confirmnewpassword"
          type="password"
          value={confirmNewPassword}
          onChange={handleConfirmNewPasswordChange}
          isRequired
          validated={
            isValidPassword ? ValidatedOptions.default : ValidatedOptions.error
          }
          className="update_confirmnewpassword_input"
        />
        <ActionList>
          <ActionListItem>
            <Button type="submit">Submit</Button>
          </ActionListItem>
        </ActionList>
      </CardBody>
    </Card>
  );
};

export default ChangePasswordForm;
