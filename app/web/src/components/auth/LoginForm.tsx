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
import React, { useEffect } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Stylesheet } from "@lib/utils";
import LoadingButton from "@components/form/LoadingButton";

const palLoginStyles: Stylesheet = {
  loginForm: {
    ...style.card,
    width: "25rem",
    height: "fit-content",
    margin: "0 auto",
  },
  titleHeading: {
    fontSize: "50px",
    fontWeight: "700",
    textAlign: "center",
    color: "var(--pf-v5-global--primary-color--500)",
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

export const PalLoginForm: React.FunctionComponent<
  PalLoginFormProps
> = ({}: PalLoginFormProps) => {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("callbackUrl") || "/";
  const [username, setUsername] = React.useState("");
  const [isValidUsername, setIsValidUsername] = React.useState(true);
  const [password, setPassword] = React.useState("");
  const [isValidPassword, setIsValidPassword] = React.useState(true);
  const [helperTxt, setHelperTxt] = React.useState("");
  const [loading, setIsLoading] = React.useState(false);

  useEffect(() => {
    // if authentication fails, nextauth refresh page and add error to the url
    if (searchParams.get("error")) {
      setHelperTxt("Wrong username or password.");
    }
  }, [searchParams]);

  const handleUsernameChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setUsername(value);
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
    const needHelperText = !username || !password;
    setIsLoading(true);
    setIsValidUsername(!!username);
    setIsValidPassword(!!password);

    try {
      if (!needHelperText) {
        await signIn("customCognito", {
          username: username,
          password: password,
          callbackUrl: redirectUrl,
          redirect: true,
        });
      } else {
        setHelperTxt("Please fill out all fields.");
      }
    } catch (error: any) {
      console.error("An unexpected error happened:", error);
      setHelperTxt("Error happened.");
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
      <CardTitle style={palLoginStyles.titleHeading}>Log in</CardTitle>
      <CardBody style={palLoginStyles.cardBody}>
        {helperTxt != "" ? (
          <>
            <HelperText>
              <HelperTextItem
                variant="error"
                hasIcon
                icon={<ExclamationCircleIcon />}
              >
                {helperTxt}
              </HelperTextItem>
            </HelperText>
          </>
        ) : null}
        <TextInput
          aria-label="username"
          name="username"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          isRequired
          validated={
            isValidUsername ? ValidatedOptions.default : ValidatedOptions.error
          }
          style={palLoginStyles.loginEmailInput}
          data-ouia-component-id="login_username_input"
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
            <LoadingButton onClick={onLoginButtonClick} className="auth-button">
              Submit
            </LoadingButton>
          </ActionListItem>
        </ActionList>
      </CardBody>
    </Card>
  );
};
