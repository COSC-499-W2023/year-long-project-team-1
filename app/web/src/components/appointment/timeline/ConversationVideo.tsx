import {
  Panel,
  PanelHeader,
  Title,
  PanelMain,
  PanelMainBody,
  PanelFooter,
} from "@patternfly/react-core";
import { time } from "console";
import style from "styled-jsx/style";

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
  paddingTop: "0.5rem",
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

interface ConversationVideoProps {
  url: string;
  sender: string;
  time: string;
  style?: React.CSSProperties;
}

export const ConversationVideo = ({
  url,
  sender,
  time,
  style,
}: ConversationVideoProps) => {
  return (
    <Panel style={style}>
      <PanelHeader style={headerStyles}>
        <Title headingLevel="h3">Video from: {sender}</Title>
      </PanelHeader>
      <PanelMain>
        <PanelMainBody style={mainStyles}>
          <video controls>
            <source src={url} />
          </video>
        </PanelMainBody>
      </PanelMain>
      <PanelFooter style={footerStyles}>
        <time style={timeStyles}>{time}</time>
      </PanelFooter>
    </Panel>
  );
};
