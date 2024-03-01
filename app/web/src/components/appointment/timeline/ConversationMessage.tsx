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
  fontSize: "0.75rem",
  color: "grey",
};

interface ConversationMessageProps {
  message: string;
  sender: string;
  time: string;
  style?: React.CSSProperties;
}

export const ConversationMessage = ({
  message,
  sender,
  time,
  style,
}: ConversationMessageProps) => {
  return (
    <Panel style={style}>
      <PanelHeader style={headerStyles}>
        <Title headingLevel="h3">{sender}</Title>
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
