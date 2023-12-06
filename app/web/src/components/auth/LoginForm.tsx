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
import Link from "next/link";
import style from "@assets/style";
import { utf8ToBase64 } from "@lib/base64";
import { useRouter } from "next/navigation";
import { logIn } from "@app/actions";

const palLoginStyles: { [key: string]: React.CSSProperties } = {
  loginForm: {
    ...style.card,
    width: "25rem",
    height: "fit-content",
    margin: "0 auto",
  },
  centerButton: {
    justifyContent: "center",
  },
  rightLink: {
    textAlign: "right",
    width: "100%",
  },
  loginEmailInput: {
    background: "var(--privacy-pal-primary-color)",
    width: "100%",
  },
  loginPasswordInput: {
    width: "100%",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
};

export interface PalLoginFormProps {
  redirectUrl?: string;
}

export const PalLoginForm: React.FunctionComponent<PalLoginFormProps> = ({
  redirectUrl,
}: PalLoginFormProps) => {
  const router = useRouter();

  const [showHelperText, setShowHelperText] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [isValidEmail, setIsValidEmail] = React.useState(true);
  const [password, setPassword] = React.useState("");
  const [isValidPassword, setIsValidPassword] = React.useState(true);
  const [loading, setIsLoading] = React.useState(false);

  const handleEmailChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setEmail(value);
  };

  const handlePasswordChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setPassword(value);
  };

  const onLoginButtonClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    const needHelperText = !email || !password;
    setIsLoading(true);
    setIsValidEmail(!!email);
    setIsValidPassword(!!password);
    setShowHelperText(needHelperText);

    try {
      if (!needHelperText) {
        await logIn(email, password, redirectUrl);
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

  return (
    <Card style={palLoginStyles.loginForm}>
      <CardTitle component="h1">Log in</CardTitle>
      <CardBody style={palLoginStyles.cardBody}>
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
          aria-label="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          isRequired
          validated={
            isValidEmail ? ValidatedOptions.default : ValidatedOptions.error
          }
          style={palLoginStyles.loginEmailInput}
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
          validated={
            isValidPassword ? ValidatedOptions.default : ValidatedOptions.error
          }
          style={palLoginStyles.loginPasswordInput}
          data-ouia-component-id="login_password_input"
        />

        <div style={palLoginStyles.rightLink}>{forgotCredentials}</div>

        <ActionList style={style.actionList}>
          <ActionListItem>
            <Button onClick={onLoginButtonClick} type="submit">
              Submit
            </Button>
          </ActionListItem>
          <ActionListItem>
            <Link href="/signup">
              <Button isDisabled={true}>Sign up with Code</Button>
            </Link>
          </ActionListItem>
        </ActionList>
      </CardBody>
    </Card>
  );
};
