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
import { Text } from "@patternfly/react-core";
import { CheckIcon, TimesIcon } from "@patternfly/react-icons";

const selectedItemStyle: CSS = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.5rem",
};

interface SelectedItemProps {
  hide?: boolean;
  selected?: boolean;
  style?: CSS;
  children?: React.ReactNode;
}

export const SelectedItem = ({
  hide,
  selected = true,
  style,
  children,
}: SelectedItemProps) => {
  if (hide) {
    return null;
  }

  const icon = selected ? (
    <CheckIcon color="green" />
  ) : (
    <TimesIcon color="red" />
  );

  return (
    <Text style={{ ...selectedItemStyle, ...style }}>
      {icon}
      {children}
    </Text>
  );
};
