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

  const icon = selected ? <CheckIcon /> : <TimesIcon />;

  return (
    <Text style={{ ...selectedItemStyle, ...style }}>
      {icon}
      {children}
    </Text>
  );
};
