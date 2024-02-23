"use client";

import { CSS } from "@lib/utils";
import {
  Panel,
  PanelFooter,
  PanelHeader,
  PanelMain,
  Title,
} from "@patternfly/react-core";

const panelStyle: CSS = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  height: "75vh",
  flexBasis: `${100 / 3}%`,
  borderRight: "1px solid grey",
};

const headerStyle: CSS = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  height: "4rem",
  width: "100%",
  borderBottom: "1px solid grey",
  padding: "1rem",
};

const titleStyle: CSS = {
  fontSize: "1.5rem",
  fontWeight: "700",
  textTransform: "uppercase",
};

const listStyle: CSS = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  padding: "1rem",
  flexGrow: "1",
};

const footerStyle: CSS = {
  ...headerStyle,
  borderTop: "1px solid grey",
  borderBottom: "none",
};

export const ConversationList = () => {
  return (
    <Panel style={panelStyle}>
      <PanelHeader style={headerStyle}>
        <Title headingLevel="h1" size="xl" style={titleStyle}>
          Appointments
        </Title>
      </PanelHeader>
      <PanelMain style={listStyle}>
        <p>Conversation List</p>
      </PanelMain>
      <PanelFooter style={footerStyle}>Footer</PanelFooter>
    </Panel>
  );
};
