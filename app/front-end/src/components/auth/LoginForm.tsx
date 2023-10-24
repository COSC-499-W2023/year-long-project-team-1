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
import { SignInResponse, signIn, useSession } from "next-auth/react";

export const PalLoginPage: React.FunctionComponent = () => {
    const { data: session, status } = useSession();

    const [showHelperText, setShowHelperText] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [isValidEmail, setIsValidEmail] = React.useState(true);
    const [password, setPassword] = React.useState("");
    const [isValidPassword, setIsValidPassword] = React.useState(true);
    const [isRememberMeChecked, setIsRememberMeChecked] = React.useState(false);

    const handleEmailChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        setEmail(value);
    };

    const handlePasswordChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        setPassword(value);
    };

    const onLoginButtonClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        const needHelperText = !email || !password;
        setIsValidEmail(!!email);
        setIsValidPassword(!!password);
        setShowHelperText(needHelperText);

        if (!needHelperText) {
            try {
                const response: SignInResponse | undefined = await signIn("credentials", {
                    redirect: false,
                    email,
                    password,
                });

                if (response?.error) {
                    throw new Error("Error signing in.");
                }

                console.log(JSON.stringify(response, null, 2));
            } catch (error: any) {
                console.error("An unexpected error happened:", error);
                setShowHelperText(true);
            }
        }
    };

    const forgotCredentials = (
        <>
            <Link href="#forgotpassword">Forgot password?</Link>
        </>
    );

    if (status === "loading") {
        <Card>
            <CardBody>Loading...</CardBody>
        </Card>;
    }

    return (
        <Card className={styles.loginForm}>
            <CardTitle component="h1">Log In</CardTitle>
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
                    aria-label="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    isRequired
                    validated={isValidEmail ? ValidatedOptions.default : ValidatedOptions.error}
                    data-ouia-component-id="login_email_input"
                />
                <br />
                <TextInput
                    aria-label="password"
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    isRequired
                    validated={isValidPassword ? ValidatedOptions.default : ValidatedOptions.error}
                    data-ouia-component-id="login_password_input"
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
