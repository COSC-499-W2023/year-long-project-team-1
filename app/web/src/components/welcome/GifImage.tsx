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
import gifimage from "@assets/welcome.gif";
import Image from "next/image";

const gifContainerStyle: CSS = {
  position: "absolute",
  top: "80%",
  left: "30%",
  transform: "translate(-75%, -75%)",
};

const GifImage: React.FC = () => {
  return (
    <div style={gifContainerStyle}>
      <Image
        src={gifimage.src}
        alt="Background"
        width={gifimage.width * 1.25}
        height={gifimage.height * 1.25}
      />
    </div>
  );
};

export default GifImage;
