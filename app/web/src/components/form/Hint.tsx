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
import { CSS } from "@lib/utils";
import { Text } from "@patternfly/react-core";

interface HintProps {
  message: string;
  italic?: boolean;
  style?: CSS;
}

export const Hint = ({ message, italic = false, style }: HintProps) => {
  return (
    <Text
      style={{
        fontStyle: italic ? "italic" : "normal",
        lineHeight: "1.1",
        fontSize: "0.75em",
        color: "var(--pf-v5-global--palette--black-500)",
        ...style,
      }}
    >
      {message}
    </Text>
  );
};
