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
  LoginForm,
  LoginMainFooterBandItem,
  LoginPage,
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { CSS } from "@lib/utils";
import LoadingButton from "@components/form/LoadingButton";

const loginPage: CSS = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  top: "-5%",
  left: "30%",
  position: "absolute",
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
  const [showHelperText, setShowHelperText] = React.useState(false);
  const [loading, setIsLoading] = React.useState(false);
  const [helperTxt, setHelperTxt] = React.useState("");

  useEffect(() => {
    // if authentication fails, nextauth refresh page and add error to the url
    if (searchParams.get("error")) {
      setHelperTxt("Wrong username or password.");
      setShowHelperText(!username || !password);
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
    setShowHelperText(!username || !password);

    try {
      if (!needHelperText) {
        await signIn("customCognito", {
          username: username,
          password: password,
          callbackUrl: redirectUrl,
          redirect: true,
        });
      } else {
        setShowHelperText(true);
        setHelperTxt("Please fill out all fields.");
      }
    } catch (error: any) {
      setShowHelperText(true);
      console.error("An unexpected error happened:", error);
      setHelperTxt("Error happened.");
    } finally {
      setIsLoading(false);
    }
  };

  const forgotCredentials = (
    <LoginMainFooterBandItem>
      <a href="#forgotpassword">Forgot username or password?</a>
    </LoginMainFooterBandItem>
  );

  const loginForm = (
    <LoginForm
      showHelperText={showHelperText}
      helperText={<span style={{ color: "red" }}>{helperTxt}</span>}
      helperTextIcon={<ExclamationCircleIcon style={{ color: "red" }} />}
      usernameLabel="Username"
      usernameValue={username}
      onChangeUsername={handleUsernameChange}
      isValidUsername={isValidUsername}
      passwordLabel="Password"
      passwordValue={password}
      isShowPasswordEnabled
      onChangePassword={handlePasswordChange}
      isValidPassword={isValidPassword}
      onLoginButtonClick={onLoginButtonClick}
    ></LoginForm>
  );

  return (
    <LoginPage
      style={loginPage}
      loginTitle="Log into your account"
      forgotCredentials={forgotCredentials}
    >
      {loginForm}
      {/* <LoadingButton
          onClick={onLoginButtonClick}
          className="auth-button"
        >
          Log In
        </LoadingButton> */}
    </LoginPage>
  );
};
