"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Panel,
  PanelFooter,
  PanelHeader,
  PanelMain,
  PanelMainBody,
  Title,
} from "@patternfly/react-core";

const headerStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  paddingTop: "0",
  paddingBottom: "0",
};

const titleStyles = {
  fontSize: "1.5rem",
  fontWeight: "bold",
};

const mainStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  paddingTop: "0",
  paddingBottom: "0",
};

const footerStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  paddingTop: "0",
  paddingBottom: "0",
};

const timeStyles: React.CSSProperties = {
  fontSize: "0.67rem",
  color: "grey",
};

interface ConversationMessageProps {
  message: string;
  sender: string;
  time: string;
  showTitle?: boolean;
  style?: React.CSSProperties;
}

export const ConversationMessage = ({
  message,
  sender,
  time,
  showTitle = true,
  style,
}: ConversationMessageProps) => {
  return (
    <Panel style={style}>
      <PanelHeader style={headerStyles}>
        {showTitle ? (
          <Title headingLevel="h3">Message from: {sender}</Title>
        ) : null}
      </PanelHeader>
      <PanelMain>
        <PanelMainBody style={mainStyles}>
          <p>{message}</p>
        </PanelMainBody>
      </PanelMain>
      <PanelFooter style={footerStyles}>
        <time style={timeStyles}>{time}</time>
      </PanelFooter>
    </Panel>
  );
};
