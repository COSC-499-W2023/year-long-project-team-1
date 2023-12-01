// components/UserUpdateForm.tsx
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
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import Link from "next/link";
import { User } from "@prisma/client";

interface UserUpdateFormProps {
  user: User;
  email: string;
  isPasswordForm?: boolean;
}

const UserUpdateForm: React.FunctionComponent<UserUpdateFormProps> = ({ user, email, isPasswordForm }: UserUpdateFormProps) => {
  const [showHelperText, setShowHelperText] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isValidNewPassword, setIsValidNewPassword] = useState(true);
  const [isValidConfirmNewPassword, setIsValidConfirmNewPassword] = useState(true);

  const handleCurrentPasswordChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setCurrentPassword(value);
  };

  const handleNewPasswordChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setNewPassword(value);
  };

  const handleConfirmNewPasswordChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setConfirmNewPassword(value);
  };

  const onUpdateButtonClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    setShowHelperText(false);

    if (isPasswordForm) {
      // Validate new password and confirm new password
      setIsValidNewPassword(!!newPassword);
      setIsValidConfirmNewPassword(newPassword === confirmNewPassword);

      if (!newPassword || !confirmNewPassword || newPassword !== confirmNewPassword) {
        setShowHelperText(true);
        return;
      }

      // Call API endpoint to update password
      try {
        // Your API call for updating password
        alert("Password update logic would go here.");
      } catch (error: any) {
        console.error("An unexpected error happened:", error);
        setShowHelperText(true);
      } finally {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } else {
      // Logic for updating general information
      // Similar to your existing implementation
      // You can handle it here or call another function to handle
    }
  };

  return (
    <Card className="updateForm">
      <CardTitle component="h1">{isPasswordForm ? "Change Password" : "Update Account"}</CardTitle>
      <CardBody>
        {showHelperText && (
          <HelperText>
            <HelperTextItem variant="error" hasIcon icon={<ExclamationCircleIcon />}>
              {isPasswordForm ? "Password and Confirm Password must match." : "Please fill out all fields."}
            </HelperTextItem>
          </HelperText>
        )}

        {isPasswordForm && (
          <>
            <TextInput
              aria-label="currentPassword"
              placeholder="Current Password"
              name="currentPassword"
              type="password"
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
              isRequired
              className="update_currentPassword_input"
            />
            <TextInput
              aria-label="newPassword"
              placeholder="New Password"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              isRequired
              validated={isValidNewPassword ? ValidatedOptions.default : ValidatedOptions.error}
              className="update_newPassword_input"
            />
            <TextInput
              aria-label="confirmNewPassword"
              placeholder="Confirm New Password"
              name="confirmNewPassword"
              type="password"
              value={confirmNewPassword}
              onChange={handleConfirmNewPasswordChange}
              isRequired
              validated={isValidConfirmNewPassword ? ValidatedOptions.default : ValidatedOptions.error}
              className="update_confirmNewPassword_input"
            />
          </>
        )}

        {/* Add other form fields for general information update if needed */}

        <ActionList>
          <ActionListItem>
            <Button onClick={onUpdateButtonClick}>{isPasswordForm ? "Change Password" : "Update Account"}</Button>
          </ActionListItem>
          <ActionListItem>
            <Link href={isPasswordForm ? "/user/account/update" : "login"}>
              <Button>{isPasswordForm ? "Back to Account" : "Back to Login"}</Button>
            </Link>
          </ActionListItem>
        </ActionList>
      </CardBody>
    </Card>
  );
};

export default UserUpdateForm;
