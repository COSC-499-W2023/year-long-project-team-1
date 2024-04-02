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
  Divider,
  LoginForm,
  LoginMainFooterBandItem,
  LoginPage,
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { CSS, Stylesheet } from "@lib/utils";
import LoadingButton from "@components/form/LoadingButton";
import Link from "next/link";

const loginPage: CSS = {
  // width: "25rem",
  // margin: "auto",
  // position: "absolute",
  // left: "50%",
  // top: "50%",
  // transform: "translate(-40%, -50%)",


};
const styles: Stylesheet = {
  main: {
    display: "flex",
    justifyContent: "center",
  },
  titleHeading: {
    fontSize: "30px",
    // fontWeight: "700",
    // textAlign: "center",
    color: "rgba(0, 0, 0)",
  },

  card: {
    width: "30rem",
    position: "relative",
    margin: "auto auto",
    boxShadow: "1px 6px 20px rgba(0, 0, 0, 0.1)",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    alignItems: "left"
  },
  actionList: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: "2rem 0rem 1rem 0rem",
    width: "100%",
  },
  actionListItem: {
    width: "100%",
    listStyleType: "none",
    margin: "1rem",
  },
  button: {
    width: "100%",
  },
  formGroup: {
    width: "100%",
    textAlign: "left",
    paddingLeft: "1rem",
    paddingRight: "1rem",
  },
  form: {
    height: "100%",
    width: "100%",
  },
  forgotContainer: {
    alignContent: "center",
    justifyContent: "center",
  }

};

export interface PalLoginFormProps {
  redirectUrl?: string;
}

export const PalLoginForm: React.FunctionComponent<
  PalLoginFormProps
> = ({ }: PalLoginFormProps) => {
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
      <a href="https://privacypal.auth.ca-central-1.amazoncognito.com/forgotPassword?client_id=7du2a5dvukpbmf851o8t9gffv4&response_type=code&scope=email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fcognito">
        Forgot username or password?
      </a>
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
    <Card className="verificationForm" style={styles.card}>
      <CardTitle component="h1" style={styles.titleHeading}>
        Log into your account      </CardTitle>
      <Divider />
      <CardBody style={styles.cardBody}>
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
        <Divider />
        <Link style={styles.forgotContainer} href="https://privacypal.auth.ca-central-1.amazoncognito.com/forgotPassword?client_id=7du2a5dvukpbmf851o8t9gffv4&response_type=code&scope=email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fcognito">Forgot username or password?</Link>
      </CardBody>
    </Card>
  );
};
