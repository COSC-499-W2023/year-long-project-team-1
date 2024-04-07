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
// Import React and necessary components
import React from "react";
import { CSS } from "@lib/utils";
import background from "@assets/welcomebackground.svg";
import Image from "next/image";
import GifImage from "./GifImage";
import AboutUs from "./AboutUs";
import FeedbackForm from "@components/welcome/FeedbackForm";
import { Icon, Tooltip } from "@patternfly/react-core";
import { CgArrowDownO } from "react-icons/cg";
import { DownArrow } from "./DownArrow";

const containerStyle: CSS = {
  position: "fixed",
  zIndex: 0,
  width: "100vw",
  top: 0,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundRepeat: "no-repeat",
  marginTop: "var(--pal-header-height)",
  height: "calc(100vh - var(--pal-footer-height) - 4.5rem) ",
};

const welcomeContainer: CSS = {
  left: "-4rem",
  position: "relative",
  padding: "0 2rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "calc(100vh-var(--pal-footer-height)-var(--pal-header-height))",
  maxWidth: "100%",
};

export const WelcomePage: React.FunctionComponent = () => {
  return (
    <div style={containerStyle}>
      <div style={welcomeContainer}>
        <GifImage />
        <AboutUs />
      </div>
      <DownArrow />
      <FeedbackForm />
    </div>
  );
};
