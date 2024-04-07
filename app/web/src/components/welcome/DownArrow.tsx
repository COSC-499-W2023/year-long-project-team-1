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

import { CSS } from "@lib/utils";
import { Tooltip, Icon } from "@patternfly/react-core";
import { CgArrowDownO } from "react-icons/cg";

const downArrowStyle: CSS = {
  position: "absolute",
  bottom: "5vh",
  color: "var(--pf-v5-global--primary-color--500)",
  animation: "hover 1s infinite ease-in-out",
};

interface DownArrowProps {
  text?: string;
  style?: CSS;
}

export const DownArrow = ({ text, style }: DownArrowProps) => {
  return (
    <Tooltip
      content={text ?? "Scroll down for more information"}
      className="down-arrow-tooltip"
    >
      <div style={{ ...style, ...downArrowStyle }}>
        <Icon size="xl">
          <CgArrowDownO style={{ filter: "drop-shadow(0 0 0.5rem #aaaaaa)" }} />
        </Icon>
      </div>
    </Tooltip>
  );
};
