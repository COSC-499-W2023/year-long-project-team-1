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
import { Hint } from "@components/form/Hint";
import { Switch, Title, Tooltip } from "@patternfly/react-core";

interface BlurSettingsHeadingProps {
  switchAriaLabel: string;
  text?: string;
  hint?: string;
  value?: boolean;
  icon?: React.ReactNode;
  onChange: (value: boolean) => void;
}

export const BlurSettingsSwitch = ({
  switchAriaLabel,
  text,
  hint,
  value,
  icon,
  onChange,
}: BlurSettingsHeadingProps) => {
  const handleChange = (value: boolean) => {
    onChange(value);
  };

  const settingsSwitch = (
    <Switch
      id={
        switchAriaLabel
          .split(" ")
          .filter((word) => word.length > 0)
          .map((word) => word.toLowerCase())
          .join("-") + "-switch"
      }
      isChecked={value}
      onChange={(_, value) => handleChange(value)}
      ouiaId={switchAriaLabel}
      aria-label={switchAriaLabel}
    />
  );

  return (
    <span
      style={{
        display: "flex",
        gap: "1rem",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
        {icon}
        <Title headingLevel="h3" size="md" style={{ whiteSpace: "nowrap" }}>
          {text}
        </Title>
      </span>
      {hint ? (
        <Tooltip content={<Hint message={hint} style={{ color: "white" }} />}>
          {settingsSwitch}
        </Tooltip>
      ) : (
        settingsSwitch
      )}
    </span>
  );
};
