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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logIn } from "@app/actions";

export interface ChangePasswordFormProps {
    redirectUrl?: string;
}

const ChangePasswordForm: React.FunctionComponent<ChangePasswordFormProps> = ({ redirectUrl }: ChangePasswordFormProps) => {
    const router = useRouter();

    const [showHelperText, setShowHelperText] = React.useState(false);
    const [currentpassword, setCurrentPassword] = React.useState("");
    const [newpassword, setNewPassword] = React.useState("");
    const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
    const [isValidPassword, setIsValidPassword] = React.useState(true);
    const [loading, setIsLoading] = React.useState(false);

    const handleCurrentPasswordChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        setCurrentPassword(value);
    };

    const handleNewPasswordChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        setNewPassword(value);
    };

    const handleConfirmNewPasswordChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        setConfirmNewPassword(value);
    };

    const onLoginButtonClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        const needHelperText = !currentpassword || !newpassword || !confirmNewPassword;
        setIsLoading(true);
        setIsValidPassword(!!newpassword && newpassword === confirmNewPassword);
        setShowHelperText(needHelperText);

        // skip checks if not enough info
        if (needHelperText) {
            return;
        }

        try {
            if (!needHelperText) {
                await logIn(currentpassword, newpassword, redirectUrl);
            }
        } catch (error: any) {
            console.error("An unexpected error happened:", error);
            setShowHelperText(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="loginForm">
            <CardTitle component="h1">Log in</CardTitle>
            <CardBody>
                {showHelperText ? (
                    <>
                        <HelperText>
                            <HelperTextItem variant="error" hasIcon icon={<ExclamationCircleIcon />}>
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
                    validated={isValidPassword ? ValidatedOptions.default : ValidatedOptions.error}
                    className="update_currentpassword_input"
                    data-ouia-component-id="update_currentpassword_input"
                />
                <TextInput
                    aria-label="update-newpassword"
                    placeholder="New Password"
                    name="update-newpassword"
                    type="password"
                    value={newpassword}
                    onChange={handleNewPasswordChange}
                    isRequired
                    validated={isValidPassword ? ValidatedOptions.default : ValidatedOptions.error}
                    className="update_newpassword_input"
                    data-ouia-component-id="update_newpassword_input"
                />
                <TextInput
                    aria-label="update-confirmnewpassword"
                    placeholder="Confirm New Password"
                    name="update-confirmnewpassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={handleConfirmNewPasswordChange}
                    isRequired
                    validated={isValidPassword ? ValidatedOptions.default : ValidatedOptions.error}
                    className="update_confirmnewpassword_input"
                    data-ouia-component-id="update_confirmnewpassword_input"
                />

                <ActionList>
                    <ActionListItem>
                        <Button onClick={onLoginButtonClick} type="submit">
                            Submit
                        </Button>
                    </ActionListItem>
                </ActionList>
            </CardBody>
        </Card>
    );
};

export default ChangePasswordForm;
