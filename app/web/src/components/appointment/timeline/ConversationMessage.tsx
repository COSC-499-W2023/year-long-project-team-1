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

import {
  Panel,
  PanelFooter,
  PanelHeader,
  PanelMain,
  PanelMainBody,
  Title,
} from "@patternfly/react-core";
import { CSS } from "@lib/utils";
import { DeleteMessageButton } from "./DeleteMessageButton";

const headerStyles: CSS = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  paddingTop: "0",
  paddingBottom: "0",
};

const titleStyles = {
  fontSize: "1.5rem",
  fontWeight: "bold",
};

const mainStyles: CSS = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  paddingTop: "0",
  paddingBottom: "0",
};

const footerStyles: CSS = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  paddingTop: "0",
  paddingBottom: "0",
};

const timeStyles: CSS = {
  fontSize: "0.67rem",
  color: "grey",
};

interface ConversationMessageProps {
  apptId: number;
  messageId: number;
  message: string;
  sender: string;
  time: string;
  showTitle?: boolean;
  style?: CSS;
  onDelete?: () => void;
}

export const ConversationMessage = ({
  apptId,
  messageId,
  message,
  sender,
  time,
  showTitle = true,
  style,
  onDelete,
}: ConversationMessageProps) => {
  return (
    <Panel style={style}>
      <PanelHeader style={headerStyles}>
        {showTitle ? (
          <Title headingLevel="h3">Message from: {sender}</Title>
        ) : null}

        {onDelete && messageId > -1 ? (
          <DeleteMessageButton
            messageId={messageId}
            apptId={apptId}
            onDelete={onDelete}
          />
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
