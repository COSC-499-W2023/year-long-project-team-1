/*
 * Created on Mon Oct 23 2023
 * Author: Connor Doman
 */
"use client";
import React from "react";
import {
    Card,
    CardBody,
    CardFooter,
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
import styles from "./LoginForm.module.css";

export const PalLoginPage: React.FunctionComponent = () => {
    const [showHelperText, setShowHelperText] = React.useState(false);
    const [username, setUsername] = React.useState("");
    const [isValidUsername, setIsValidUsername] = React.useState(true);
    const [password, setPassword] = React.useState("");
    const [isValidPassword, setIsValidPassword] = React.useState(true);
    const [isRememberMeChecked, setIsRememberMeChecked] = React.useState(false);

    const handleUsernameChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        setUsername(value);
    };

    const handlePasswordChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        setPassword(value);
    };

    const onRememberMeClick = () => {
        setIsRememberMeChecked(!isRememberMeChecked);
    };

    const onLoginButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setIsValidUsername(!!username);
        setIsValidPassword(!!password);
        setShowHelperText(!username || !password);
    };

    const forgotCredentials = (
        <>
            <Link href="#forgotpassword">Forgot password?</Link>
        </>
    );

    return (
        <Card className={styles.loginForm}>
            <CardTitle component="h1">Login</CardTitle>
            <CardBody>
                {showHelperText ? (
                    <>
                        <HelperText>
                            <HelperTextItem variant="error" hasIcon icon={<ExclamationCircleIcon />}>
                                Please fill out all fields.
                            </HelperTextItem>
                        </HelperText>
                        <br />
                    </>
                ) : null}
                <TextInput
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange}
                    isRequired
                    validated={isValidUsername ? ValidatedOptions.default : ValidatedOptions.error}
                />
                <br />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    isRequired
                    validated={isValidPassword ? ValidatedOptions.default : ValidatedOptions.error}
                />
                <br />
                <ActionList>
                    <ActionListItem>
                        <Button onClick={onLoginButtonClick}>Submit</Button>
                    </ActionListItem>
                    <ActionListItem>
                        <Link href="#signupwithcode">
                            <Button>Sign up with Code</Button>
                        </Link>
                    </ActionListItem>
                </ActionList>
            </CardBody>
            <CardFooter>{forgotCredentials}</CardFooter>
        </Card>
    );
};
