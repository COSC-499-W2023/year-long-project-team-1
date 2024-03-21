import React from "react";
import { CSS } from "@lib/utils";
import LinkButton from "@components/form/LinkButton";

const container: CSS = {
  position: "relative",
  marginLeft: "25%",
  width: "40%",
};
const welcomeText: CSS = {
  fontFamily: "Inter",
  color: "#0066CC",
  position: "absolute",
  fontStyle: "normal",
  fontWeight: 500,
  textAlign: "justify",
  letterSpacing: "0.1em",
  fontSize: "125%",
};
const welcomeTextContainer: CSS = {
  position: "absolute",
};
const privacyPalTextContainer: CSS = {
  textAlign: "center",
  top: "50%",
  left: "50%",
};
const aboutUsContainer: CSS = {
  textAlign: "justify",
};
const aboutUsText: CSS = {
  fontFamily: "Inter",
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
};
const text2: CSS = {
  marginBottom: "3rem",
  fontSize: "50px",
  fontWeight: "bolder",
  margin: "0.5rem 0",
  color: "#F58658",
};

const buttonContainer: CSS = {
  marginTop: "1.5rem",
  textAlign: "center",
};

const AboutUs: React.FC = () => {
  return (
    <div style={container}>
      <div style={welcomeTextContainer}>
        <h1 style={welcomeText}>WELCOME!</h1>
      </div>
      <br />
      <br />
      <div style={privacyPalTextContainer}>
        <h1 style={text1}>A SOLUTION TO ABSOLUTE </h1>
        <h1 style={text2}>PRIVACY.</h1>
      </div>
      <div style={aboutUsContainer}>
        <h1 style={aboutUsText}>
          Welcome to PrivacyPal, where your health and privacy are our top
          priorities. We understand that your personal health information is
          sensitive and deserves the highest level of protection. Our service is
          designed with your privacy in mind, ensuring that your medical data
          and personal details are safeguarded at all times.
        </h1>
      </div>
      <div style={buttonContainer}>
        <LinkButton href="/staff" label="Get Started" />
      </div>
    </div>
  );
};
export default AboutUs;
