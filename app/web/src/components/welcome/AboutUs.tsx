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
import React from "react";
import { CSS } from "@lib/utils";
import { Inter } from "next/font/google";
import LoadingButton from "@components/form/LoadingButton";

const inter = Inter({ subsets: ["latin"] });

const container: CSS = {
  padding: "10vh 0vh",
  marginLeft: "45%",
  width: "100vh",
  height: "90vh",
  top: "20%",
};
const welcomeText: CSS = {
  color: "#0066CC",
  // position: "absolute",
  fontStyle: "normal",
  fontWeight: 500,
  textAlign: "justify",
  letterSpacing: "0.1em",
  fontSize: "125%",
  textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
};
const welcomeTextContainer: CSS = {
  position: "absolute",
};
const privacyPalTextContainer: CSS = {
  textAlign: "center",
  top: "80%",
  left: "50%",
};
const aboutUsContainer: CSS = {
  textAlign: "justify",
};
const aboutUsText: CSS = {
  color: "rgba(0,0,0,0.5)",
  fontStyle: "normal",
  fontWeight: "500",
  textAlign: "justify",
  letterSpacing: "0.1em",
};
const text1: CSS = {
  fontSize: "50px",
  fontWeight: "bolder",
  color: "var(--pf-v5-global--primary-color--500)",
  margin: "0.5rem 0",
  textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
};
const text2: CSS = {
  marginBottom: "3rem",
  fontSize: "50px",
  fontWeight: "bolder",
  margin: "0.5rem 0",
  color: "#F58658",
  textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
};

const buttonContainer: CSS = {
  marginTop: "1.5rem",
  textAlign: "center",
};

const loadingButtonText: CSS = {
  fontWeight: "bold",
};

const AboutUs: React.FC = () => {
  return (
    <div style={container}>
      <div style={welcomeTextContainer}>
        <h1 style={welcomeText} className={inter.className}>
          WELCOME!
        </h1>
      </div>
      <br />
      <br />
      <div style={privacyPalTextContainer}>
        <h1 style={text1}>A SOLUTION TO ABSOLUTE </h1>
        <h1 style={text2}>PRIVACY.</h1>
      </div>
      <br />
      <div style={aboutUsContainer}>
        <h1 style={aboutUsText} className={inter.className}>
          Welcome to PrivacyPal, where your health and privacy are our top
          priorities. We understand that your personal health information is
          sensitive and deserves the highest level of protection.
        </h1>
        <br />
        <h1 style={aboutUsText}>
          Our service is designed with your privacy in mind, ensuring that your
          medical data and personal details are safeguarded at all times.
        </h1>
      </div>
      <br />
      <div style={buttonContainer}>
        <LoadingButton href="/user/appointments" style={loadingButtonText}>
          Get Started
        </LoadingButton>
      </div>
    </div>
  );
};
export default AboutUs;
