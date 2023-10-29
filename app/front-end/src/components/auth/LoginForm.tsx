/*
 * Created on Mon Oct 23 2023
 * Author: Connor Doman
 */
"use client";
import React from "react";
import {
  Card,
  CardHeader,
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
import Image from "next/image";
import logo from "./assets/logo.png";
import Githublogo from "./assets/Github_logo.png";
import Youtubelogo from "./assets/Youtube_logo.png";
import Emaillogo from "./assets/Email_logo.png";

export const PalLoginPage: React.FunctionComponent = () => {
  const { data: session, status } = useSession();

  const [showHelperText, setShowHelperText] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [isValidEmail, setIsValidEmail] = React.useState(true);
  const [password, setPassword] = React.useState("");
  const [isValidPassword, setIsValidPassword] = React.useState(true);
  const [isRememberMeChecked, setIsRememberMeChecked] = React.useState(false);

  const handleEmailChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string
  ) => {
    setEmail(value);
  };

  const handlePasswordChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string
  ) => {
    setPassword(value);
  };

  const onLoginButtonClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const needHelperText = !email || !password;
    setIsValidEmail(!!email);
    setIsValidPassword(!!password);
    setShowHelperText(needHelperText);

    if (!needHelperText) {
      try {
        const response: SignInResponse | undefined = await signIn(
          "credentials",
          {
            redirect: false,
            email,
            password,
          }
        );

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
      <CardHeader className={styles.card_header}>
        <Image alt="logo" className={`${styles.logo} logo`} src={logo} />
        <div>
          <h1 className={`${styles.text} text`}>
            A SOLUTION TO ABSOLUTE{" "}
            <span style={{ color: "#F58658" }}>PRIVACY.</span>
          </h1>
        </div>
      </CardHeader>

      <CardTitle className={styles.card_title} component="h1">
        LOG IN
      </CardTitle>
      <CardBody className={styles.card_body}>
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
          validated={
            isValidEmail ? ValidatedOptions.default : ValidatedOptions.error
          }
          className={styles.login_email_input}
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
          validated={
            isValidPassword ? ValidatedOptions.default : ValidatedOptions.error
          }
          className={styles.login_password_input}
          data-ouia-component-id="login_password_input"
        />
        <br />
        <div className={styles.rightLink}>{forgotCredentials}</div>

        <ActionList className={styles.centerButton}>
          <ActionListItem>
            <Button onClick={onLoginButtonClick}>Submit</Button>
          </ActionListItem>
          <ActionListItem>
            <Link href="#signupwithcode">
              <Button>Sign up with Code</Button>
            </Link>
          </ActionListItem>
        </ActionList>
        <br />
      </CardBody>
      <CardFooter className={styles.card_footer}>
        <div className={`${styles["footer-item"]}`}>
          <Image alt="logo" className={`${styles["footer-logo"]}`} src={logo} />
        </div>
        <div className={`${styles["footer-item"]}`}>
          Other Sites:
          <div className={styles.footerLinks}>
            <Link href="#welcomepage">Welcome</Link>
            <Link href="#aboutus">About Us</Link>
            <Link href="#signup">Sign Up</Link>
          </div>
        </div>
        <div className={`${styles["footer-item"]}`}>
          <div>
            Follow Us
            <Link href="https://github.com/COSC-499-W2023/year-long-project-team-1">
              <Image
                alt="logo"
                className={`${styles["footer-contact-us-logo"]}`}
                src={Githublogo}
              />
            </Link>
            <Link href="#youtube">
              <Image
                alt="logo"
                className={`${styles["footer-contact-us-logo"]}`}
                src={Youtubelogo}
              />
            </Link>
            <Link href="#Email">
              <Image
                alt="logo"
                className={`${styles["footer-contact-us-logo"]}`}
                src={Emaillogo}
              />
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
