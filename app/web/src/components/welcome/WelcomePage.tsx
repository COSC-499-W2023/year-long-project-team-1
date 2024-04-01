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

const containerStyle: CSS = {
  position: "fixed",
  zIndex: 0,
  width: "100vw",
  top: 0,
  overflow: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundRepeat: "no-repeat",
  marginTop: "6rem",
  height: "calc(100vh - var(--pal-footer-height) - 4.5rem) ",
};

export const WelcomePage: React.FunctionComponent = () => {
  return (
    <div style={containerStyle}>
      <GifImage />
      <AboutUs />
      <FeedbackForm />
    </div>
  );
};
