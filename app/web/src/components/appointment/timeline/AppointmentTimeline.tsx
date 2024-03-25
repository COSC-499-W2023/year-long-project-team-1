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
  ProgressStepper,
  ProgressStep,
  Card,
  CardBody,
  CardHeader,
  AlertGroup,
  Alert,
  Title,
} from "@patternfly/react-core";
import { ConversationMessage } from "./ConversationMessage";
import React, { useEffect, useState } from "react";
import { ResourcesFullIcon } from "@patternfly/react-icons";
import { ChatBox } from "./ChatBox";
import { User } from "next-auth";
import { UserRole } from "@lib/userRole";
import { CognitoUser } from "@lib/cognito";
import Loading from "@app/loading";
import { ConversationVideo } from "./ConversationVideo";
import { Appointment } from "@prisma/client";
import { CSS } from "@lib/utils";
import { DeleteMessageButton } from "./DeleteMessageButton";

const messageStyle: CSS = {
  position: "relative",
  top: "-1rem",
  display: "flex",
  flexDirection: "column",
  width: "100%",
};

const timelineStyles: CSS = {
  position: "relative",
  padding: "0rem 1rem",
  transform: `translate(0, 2rem)`,
};

const alertGroupStyles: CSS = {
  position: "relative",
};

const alertStyles: CSS = {
  marginTop: "1.5rem",
  zIndex: 2,
};

const videoPlayerStyles: CSS = {
  position: "relative",
  top: "-1rem",
};

async function sendChatMessage(apptId: number, message: string, user: User) {
  const response = await fetch(`/api/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ apptId, message, username: user.username }),
  });

  if (!response.ok) {
    throw new Error("Failed to send chat message.");
  }
}

export interface AppointmentTimeline {
  data: Array<{
    time: string;
    id?: number;
    sender?: string;
    message?: string;
    url?: string;
    tags?: { key: string; value: string }[];
  }>;
}

async function fetchChatTimelines(
  apptId: number,
): Promise<AppointmentTimeline> {
  const response = await fetch(`/api/timeline?apptId=${apptId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch chat messages.");
  }
  return (await response.json()) as AppointmentTimeline;
}

interface AppointmentTimelineProps {
  appointment: Appointment;
  user: User;
  contact: CognitoUser;
  appointmentData?: AppointmentTimeline;
}

export const AppointmentTimeline = ({
  appointment,
  user,
  contact,
}: AppointmentTimelineProps) => {
  const [currentChatMessage, setCurrentChatMessage] = useState("");
  const [chatTimeline, setChatTimeline] = useState<AppointmentTimeline["data"]>(
    [],
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchChatTimelines(appointment.id)
      .then((data) => setChatTimeline(data.data))
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setLoading(false));
  }, [appointment]);

  const handleChatSend = async (message: string) => {
    try {
      setErrorMessage("");
      setLoading(true);

      await sendChatMessage(appointment.id, message, user);
      setCurrentChatMessage("");

      const newTimeline = await fetchChatTimelines(appointment.id);
      setChatTimeline(newTimeline.data);
      // router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const progressSteps = chatTimeline.map((chatEvent, index) => {
    const isMessage =
      chatEvent.message !== undefined && chatEvent.url === undefined;

    const eventContent = isMessage ? chatEvent.message : chatEvent.url;

    // if it is a video and you are not the client, then it is a message from contact
    const isContactMessage =
      isMessage &&
      chatEvent.sender === contact.username &&
      user.role !== UserRole.CLIENT;

    const eventDate = new Date(chatEvent.time).toLocaleString();

    function combineNames(user: User | CognitoUser) {
      return `${user.firstName} ${user.lastName}`;
    }

    const eventSender = combineNames(
      chatEvent.sender === user.username ? user : contact,
    );

    const deleteHandler = () => {
      const newChatTimeline = chatTimeline.filter((_, i) => i !== index);
      setChatTimeline(newChatTimeline);
    };

    const awsRef = isMessage
      ? undefined
      : eventContent?.toString().split("/").pop()?.split("?")[0];

    const eventComponent = isMessage ? (
      <ConversationMessage
        messageId={chatEvent.id ?? -1}
        message={eventContent ?? ""}
        sender={eventSender}
        time={eventDate}
        style={messageStyle}
        onDelete={deleteHandler}
      />
    ) : (
      <ConversationVideo
        awsRef={awsRef ?? ""}
        url={eventContent ?? ""}
        sender={eventSender}
        time={eventDate}
        style={videoPlayerStyles}
        onDelete={deleteHandler}
      />
    );

    return (
      <ProgressStep
        className="appointment-timeline-event"
        key={index}
        id={`appointment-event-${index}`}
        titleId={`appointment-event-${index}-title`}
        aria-label={`${isMessage ? "message" : "video"} from ${chatEvent.sender ?? user.username}`}
        style={{ position: "relative" }}
        icon={isContactMessage ? <ResourcesFullIcon color="#1d9a9f" /> : null}
      >
        {eventComponent}
        <span>&nbsp;</span>
      </ProgressStep>
    );
  });

  return (
    <Card>
      <CardHeader>
        <ChatBox
          contactName={`${contact.firstName} ${contact.lastName}`}
          value={currentChatMessage}
          onSend={handleChatSend}
        />
        <AlertGroup style={alertGroupStyles} isLiveRegion>
          {errorMessage ? (
            <Alert title="Error:" variant="danger" style={alertStyles} isInline>
              {errorMessage}
            </Alert>
          ) : null}
        </AlertGroup>
      </CardHeader>
      <CardBody style={{ position: "relative", top: "-1rem" }}>
        {loading ? (
          <Loading />
        ) : (
          <ProgressStepper
            isVertical={true}
            isCenterAligned={false}
            aria-label="Basic progress stepper with alignment"
            style={timelineStyles}
          >
            {progressSteps}
            <ProgressStep
              className="appointment-timeline-event"
              id={`appointment-schedule-step`}
              titleId={`appointment-schedule-title`}
              aria-label="Appointment scheduled"
              style={{ position: "relative" }}
              icon={<ResourcesFullIcon color="#1d9a9f" />}
            >
              <ConversationMessage
                messageId={-1}
                message={`Appointment created on ${new Date(
                  appointment.time,
                ).toLocaleString()}`}
                sender={`${user.firstName} ${user.lastName}`}
                time={new Date(appointment.time).toLocaleString()}
                showTitle={false}
                style={{
                  ...messageStyle,
                  marginBottom: "1rem",
                  transform: "translate(0, 0.5rem)",
                }}
              />
            </ProgressStep>
          </ProgressStepper>
        )}
      </CardBody>
    </Card>
  );
};
