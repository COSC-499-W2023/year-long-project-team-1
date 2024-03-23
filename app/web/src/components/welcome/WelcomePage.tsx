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
import background from "@assets/welcomebackground.svg";
import Image from "next/image";
import GifImage from "./GifImage";
import AboutUs from "./AboutUs";

const containerStyle: CSS = {
  position: "fixed",
  zIndex: 0,
  width: "100vw",
  height: "100vh",
  top: 0,
  overflow: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const imageWrapperStyle: CSS = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
};

export const WelcomePage: React.FunctionComponent = () => {
  return (
    <div style={containerStyle}>
      <div style={imageWrapperStyle}>
        <Image
          src={background.src}
          alt="Background"
          height={background.height}
          width={background.width}
          layout="responsive"
        />
      </div>
      <GifImage />
      <AboutUs />
    </div>
  );
};
