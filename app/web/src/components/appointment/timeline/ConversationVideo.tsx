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
import {
  Panel,
  PanelHeader,
  Title,
  PanelMain,
  PanelMainBody,
  PanelFooter,
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

const videoStyles = {
  width: "100%",
};

const mainStyles: CSS = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  paddingTop: "0.5rem",
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

interface ConversationVideoProps {
  awsRef: string;
  url: string;
  sender: string;
  time: string;
  style?: CSS;
  onDelete?: () => void;
}

export const ConversationVideo = ({
  awsRef,
  url,
  sender,
  time,
  style,
  onDelete,
}: ConversationVideoProps) => {
  return (
    <Panel style={style}>
      <PanelHeader style={headerStyles}>
        <Title headingLevel="h3">Video from: {sender}</Title>
        <DeleteMessageButton awsRef={awsRef} onDelete={onDelete} />
      </PanelHeader>
      <PanelMain>
        <PanelMainBody style={mainStyles}>
          <video controls style={videoStyles}>
            <source src={url} />
            Your browser does not support HTML video.
          </video>
        </PanelMainBody>
      </PanelMain>
      <PanelFooter style={footerStyles}>
        <time style={timeStyles}>{time}</time>
      </PanelFooter>
    </Panel>
  );
};
