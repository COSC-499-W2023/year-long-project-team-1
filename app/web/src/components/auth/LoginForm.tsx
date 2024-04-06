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
  ActionList,
  ActionListItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Divider,
  Form,
  FormGroup,
  HelperText,
  HelperTextItem,
  InputGroup,
  InputGroupItem,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { CSS, Stylesheet } from "@lib/utils";
import Link from "next/link";
import LoadingButton from "@components/form/LoadingButton";
import EyeIcon from "@patternfly/react-icons/dist/esm/icons/eye-icon";
import EyeSlashIcon from "@patternfly/react-icons/dist/esm/icons/eye-slash-icon";

const styles: Stylesheet = {
  main: {
    display: "flex",
    justifyContent: "center",
  },
  titleHeading: {
    fontSize: "30px",
    color: "rgba(0, 0, 0)",
  },

  card: {
    width: "30rem",
    margin: "0 auto",
    boxShadow: "1px 6px 20px rgba(0, 0, 0, 0.1)",
  },
  cardBody: {
    flexDirection: "column",
    alignItems: "left",
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
  },
  button: {
    width: "100%",
  },
  forgotContainer: {
    justifyContent: "center",
  },
  textInputBorder: {
    borderTop: "none",
    borderRight: "none",
    borderBottom: "1px solid white",
    borderLeft: "1px solid white",
  },
};
const cardFooterStyle: CSS = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
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
  const [passwordHidden, setPasswordHidden] = React.useState<boolean>(true);

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
      <Link href="https://privacypal.auth.ca-central-1.amazoncognito.com/forgotPassword?client_id=7du2a5dvukpbmf851o8t9gffv4&response_type=code&scope=email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fcognito">
        Forgot password?
      </Link>
    </>
  );

  return (
    <Card className="loginForm" style={styles.card}>
      <CardTitle component="h1" style={styles.titleHeading}>
        Log into your account{" "}
      </CardTitle>
      <Divider />
      <CardBody style={styles.cardBody}>
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
        <Form style={styles.form}>
          <FormGroup
            label="Username"
            fieldId="login-form-username"
            style={styles.formGroup}
          >
            <TextInput
              style={styles.textInputBorder}
              aria-label="username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              isRequired
              validated={
                isValidUsername
                  ? ValidatedOptions.default
                  : ValidatedOptions.error
              }
              data-ouia-component-id="login_username_input"
            />
          </FormGroup>
          <FormGroup
            label="Password"
            fieldId="login-form-password"
            style={styles.formGroup}
          >
            <InputGroup>
              <InputGroupItem isFill>
                <TextInput
                  style={styles.textInputBorder}
                  aria-label="password"
                  name="password"
                  type={passwordHidden ? "password" : "text"}
                  value={password}
                  onChange={handlePasswordChange}
                  isRequired
                  validated={
                    isValidPassword
                      ? ValidatedOptions.default
                      : ValidatedOptions.error
                  }
                  data-ouia-component-id="login_password_input"
                />
              </InputGroupItem>
              <InputGroupItem>
                <Button
                  variant="control"
                  onClick={() => setPasswordHidden(!passwordHidden)}
                  aria-label={
                    passwordHidden ? "Show password" : "Hide password"
                  }
                >
                  {passwordHidden ? <EyeIcon /> : <EyeSlashIcon />}
                </Button>
              </InputGroupItem>
            </InputGroup>
          </FormGroup>
          <ActionList style={styles.actionList}>
            <ActionListItem style={styles.actionListItem}>
              <LoadingButton
                onClick={onLoginButtonClick}
                className="auth-button"
                style={styles.button}
              >
                Log in
              </LoadingButton>
            </ActionListItem>
          </ActionList>
        </Form>
      </CardBody>
      <Divider />

      <CardFooter style={cardFooterStyle}>{forgotCredentials}</CardFooter>
    </Card>
  );
};
