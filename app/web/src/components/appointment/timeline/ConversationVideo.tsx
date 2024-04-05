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
  ActionList,
  ActionListItem,
  Alert,
} from "@patternfly/react-core";
import { CSS } from "@lib/utils";
import { DeleteMessageButton } from "./DeleteMessageButton";
import { cancelVideoProcessing } from "@app/actions";
import { CancelProcessingButtonTmp } from "@components/upload/CancelProcessingButtonTmp";
import { useState } from "react";
import LoadingButton from "@components/form/LoadingButton";
import { CheckIcon, TimesIcon } from "@patternfly/react-icons";
import style from "@assets/style";

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
  gap: "10px",
};

const timeStyles: CSS = {
  fontSize: "0.67rem",
  color: "grey",
};

interface ConversationVideoProps {
  apptId: string;
  awsRef: string;
  url: string;
  sender: string;
  time: string;
  panelStyle?: CSS;
  onDelete?: () => void;
  doneProcessed: boolean;
  underReview?: boolean;
}

export const ConversationVideo = ({
  apptId,
  awsRef,
  url,
  sender,
  time,
  panelStyle,
  onDelete,
  doneProcessed,
  underReview,
}: ConversationVideoProps) => {
  const cancelHandler = async (awsRef: string) => {
    await cancelVideoProcessing(awsRef);
    onDelete ? onDelete() : null;
  };
  const [actionMessage, setActionMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [showReviewAction, setShowReviewAction] = useState<boolean>(
    underReview || false,
  );
  const panelHeader = (
    <PanelHeader style={headerStyles}>
      <Title headingLevel="h3">Video from: {sender}</Title>
      {/* can only delete event if video is done processed, otherwise video is left in s3 output as stale since no review action is performed */}
      {onDelete && doneProcessed ? (
        <DeleteMessageButton awsRef={awsRef} onDelete={onDelete} />
      ) : null}
    </PanelHeader>
  );
  const footerTime = <time style={timeStyles}>{time}</time>;

  const handleVideoRequest = async (action: string) => {
    const successMsg =
      action == "accept"
        ? "Successfully accepted the video."
        : "Successfully rejected the video.";
    const errorMsg =
      action == "accept"
        ? "Failed to accept the video."
        : "Failed to reject the video.";
    await fetch("/api/video/review", {
      method: "POST",
      body: JSON.stringify({
        apptId: apptId,
        filename: awsRef,
        action: action,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setActionMessage(successMsg);
        } else {
          setActionMessage(errorMsg);
          setIsError(true);
        }
      })
      .catch((e) => {
        // TODO: implement fetch error user flow
        console.log("Error: ", e);
        setActionMessage(errorMsg);
        setIsError(true);
      });
  };

  const getHandler = (action: string) => {
    switch (action) {
      case "accept":
        return async () => {
          await handleVideoRequest("accept");
          if (isError == false) {
            setShowReviewAction(false);
          }
        };
      case "reject":
        return async () => {
          await handleVideoRequest("reject");
          if (isError  == false) {
            onDelete ? onDelete() : null;
          }
        };
      default:
        throw Error(`Unknow action: ${action}`);
    }
  };
  if (doneProcessed == false) {
    return (
      <Panel style={panelStyle}>
        {panelHeader}
        <PanelMain>
          <PanelMainBody style={mainStyles}>
            <div>
              {"Your video is still in process"}
              <CancelProcessingButtonTmp
                awsRef={awsRef}
                cancelHandler={cancelHandler}
              />
            </div>
          </PanelMainBody>
        </PanelMain>
        <PanelFooter style={footerStyles}>{footerTime}</PanelFooter>
      </Panel>
    );
  }
  return (
    <Panel style={panelStyle}>
      {panelHeader}
      <PanelMain>
        <PanelMainBody style={mainStyles}>
          <video controls style={videoStyles}>
            <source src={url} />
            Your browser does not support HTML video.
          </video>
        </PanelMainBody>
      </PanelMain>
      <PanelFooter style={footerStyles}>
        {footerTime}
        {showReviewAction ? (
          <ActionList style={style.actionList}>
            <ActionListItem>
              <LoadingButton
                icon={<CheckIcon />}
                onClick={getHandler("accept")}
              >
                This looks good
              </LoadingButton>
            </ActionListItem>
            <ActionListItem>
              <LoadingButton
                variant="danger"
                icon={<TimesIcon />}
                onClick={getHandler("reject")}
              >
                Cancel
              </LoadingButton>
            </ActionListItem>
          </ActionList>
        ) : null}
      </PanelFooter>
      {actionMessage === "" ? null : (
        <Alert variant={isError ? "danger" : "success"} title={actionMessage} />
      )}
    </Panel>
  );
};
