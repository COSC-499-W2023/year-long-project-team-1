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
