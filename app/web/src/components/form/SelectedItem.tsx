"use client";
import { CSS } from "@lib/utils";
import { Text } from "@patternfly/react-core";
import { CheckIcon } from "@patternfly/react-icons";

const selectedItemStyle: CSS = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.5rem",
};

interface SelectedItemProps {
  hide?: boolean;
  style?: CSS;
  children?: React.ReactNode;
}

export const SelectedItem = ({ hide, style, children }: SelectedItemProps) => {
  if (hide) {
    return null;
  }

  return (
    <Text style={{ ...selectedItemStyle, ...style }}>
      <CheckIcon />
      {children}
    </Text>
  );
};
