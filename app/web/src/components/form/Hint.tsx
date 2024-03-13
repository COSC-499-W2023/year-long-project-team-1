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
