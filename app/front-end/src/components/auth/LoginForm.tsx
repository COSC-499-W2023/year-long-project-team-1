/*
 * Created on Mon Oct 23 2023
 * Author: Connor Doman
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
import Link from "next/link";
import "./LoginForm.css";
import { signIn, useSession } from "next-auth/react";
import type { SignInResponse } from "next-auth/react";
import { useRouter } from "next/navigation";
import { utf8ToBase64 } from "@lib/base64";

export interface PalLoginFormProps {
    redirectUrl?: string;
}

export const PalLoginForm: React.FunctionComponent<PalLoginFormProps> = ({ redirectUrl }: PalLoginFormProps) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [showHelperText, setShowHelperText] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [isValidEmail, setIsValidEmail] = React.useState(true);
    const [password, setPassword] = React.useState("");
    const [isValidPassword, setIsValidPassword] = React.useState(true);
    const [loading, setIsLoading] = React.useState(false);

    const handleEmailChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        setEmail(value);
    };

    const handlePasswordChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        setPassword(value);
    };

    const onLoginButtonClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        console.log("Redicrecting to:", redirectUrl);
        try {
            const needHelperText = !email || !password;
            setIsLoading(true);
            setIsValidEmail(!!email);
            setIsValidPassword(!!password);
            setShowHelperText(needHelperText);

            if (!needHelperText) {
                const response = (await signIn("credentials", {
                    redirect: false,
                    email: email,
                    password: password,
                })) as SignInResponse;

                if (!response.ok) {
                    throw new Error("Error signing in.");
                }

                console.log("Redicrecting to:", redirectUrl);
                if (redirectUrl) router.push(redirectUrl);
            }
        } catch (error: any) {
            console.error("An unexpected error happened:", error);
            setShowHelperText(true);
        } finally {
            setIsLoading(false);
        }
    };

    const forgotCredentials = (
        <>
            <Link href="#forgotpassword">Forgot password?</Link>
        </>
    );

    if (status === "loading" || loading) {
        <Card>
            <CardBody>Loading...</CardBody>
        </Card>;
    }

    return (
        <Card className="loginForm">
            <CardTitle component="h1">LOG IN</CardTitle>
            <CardBody className="card-body">
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
                    aria-label="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    isRequired
                    validated={isValidEmail ? ValidatedOptions.default : ValidatedOptions.error}
                    className="login_email_input"
                    data-ouia-component-id="login_email_input"
                />
                <TextInput
                    aria-label="password"
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    isRequired
                    validated={isValidPassword ? ValidatedOptions.default : ValidatedOptions.error}
                    className="login_password_input"
                    data-ouia-component-id="login_password_input"
                />
                <div className="rightLink">{forgotCredentials}</div>

                <ActionList className="centerButton">
                    <ActionListItem>
                        <Button onClick={onLoginButtonClick}>Submit</Button>
                    </ActionListItem>
                    <ActionListItem>
                        <Link href="#signupwithcode">
                            <Button isDisabled={true}>Sign up with Code</Button>
                        </Link>
                    </ActionListItem>
                </ActionList>
            </CardBody>
        </Card>
    );
};
