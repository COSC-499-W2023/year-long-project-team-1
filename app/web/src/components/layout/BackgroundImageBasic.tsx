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
import Image from "next/image";
import background from "@assets/background.svg";
import { CSS } from "@lib/utils";

const containerStyle: CSS = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: -1,
};

export const BackgroundImageBasic: React.FunctionComponent = () => {
  return (
    <div style={containerStyle}>
      <Image
        src={background.src}
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
      />
    </div>
  );
};
