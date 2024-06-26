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
} from "@patternfly/react-core";
import { ConversationMessage } from "./ConversationMessage";
import React, { useEffect, useState } from "react";
import { ResourcesFullIcon } from "@patternfly/react-icons";
import { ChatBox, ChatMessage } from "./ChatBox";
import { User } from "next-auth";
import { UserRole } from "@lib/userRole";
import { CognitoUser } from "@lib/cognito";
import Loading from "@app/loading";
import { ConversationVideo } from "./ConversationVideo";
import { Appointment } from "@prisma/client";
import { CSS } from "@lib/utils";

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

export interface AppointmentTimeline {
  data: Array<{
    time: string;
    id?: number;
    sender?: string;
    message?: string;
    url?: string;
    tags?: { Key: string; Value: string }[];
    awsRef?: string;
    doneProcessed: boolean;
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

interface ProgressStepsProps {
  user: User;
  contact: CognitoUser;
  chatTimeline: AppointmentTimeline["data"];
  onDelete: (chatTimeline: AppointmentTimeline["data"]) => void;
  apptId: number;
}

const AppointmentEvents = ({
  user,
  contact,
  chatTimeline,
  onDelete,
  apptId,
}: ProgressStepsProps) => {
  return chatTimeline.map((chatEvent, index) => {
    const isMessage =
      chatEvent.message !== undefined && chatEvent.url === undefined;

    const fromContact = chatEvent.sender === contact.username;

    const eventContent = isMessage ? chatEvent.message : chatEvent.url;

    const awsRef = chatEvent.awsRef;

    // if video is done processed and still under review, there is "UnderReview" tag in api response
    var videoUnderReview: boolean | undefined = undefined;
    if (chatEvent.tags) {
      const tags = chatEvent.tags;
      videoUnderReview =
        tags.length > 0 ? tags[0].Value == "UnderReview" : false;
    }

    // if it is a video and you are not the client, then it is a message from contact
    const isContactMessage = isMessage && fromContact;

    const eventDate = new Date(chatEvent.time).toLocaleString();

    // if the video is not done processed
    const doneProcessed = chatEvent.doneProcessed;

    // if the event is video, professional should not see video that are not approved by client
    if (
      user.role == UserRole.PROFESSIONAL &&
      !isMessage &&
      (!doneProcessed || videoUnderReview)
    ) {
      return null;
    }

    function combineNames(user: User | CognitoUser) {
      return `${user.firstName} ${user.lastName}`;
    }

    const eventSender = combineNames(
      chatEvent.sender === user.username ? user : contact,
    );

    const clientName = combineNames(
      user.role === UserRole.CLIENT ? user : contact,
    );

    // if you sent the message, you can delete it
    const deleteHandler = !fromContact
      ? () => {
          const newChatTimeline = chatTimeline.filter((_, i) => i !== index);
          onDelete(newChatTimeline);
        }
      : undefined;

    const eventComponent = isMessage ? (
      <ConversationMessage
        apptId={apptId}
        messageId={chatEvent.id ?? -1}
        message={eventContent ?? ""}
        sender={eventSender}
        time={eventDate}
        style={messageStyle}
        onDelete={deleteHandler}
      />
    ) : (
      <ConversationVideo
        apptId={apptId}
        awsRef={awsRef ?? ""}
        url={eventContent ?? ""}
        sender={clientName}
        time={eventDate}
        panelStyle={videoPlayerStyles}
        onDelete={deleteHandler}
        doneProcessed={doneProcessed}
        underReview={videoUnderReview}
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
};

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

  const handleChatSend = async (message: ChatMessage) => {
    const { data: newTimeline } = await fetchChatTimelines(appointment.id);
    setChatTimeline(newTimeline);
  };

  return (
    <Card>
      <CardHeader>
        <ChatBox
          apptId={appointment.id}
          fromUser={user}
          contactName={`${contact.firstName} ${contact.lastName}`}
          onSend={handleChatSend}
          onError={setErrorMessage}
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
            <AppointmentEvents
              user={user}
              contact={contact}
              chatTimeline={chatTimeline}
              onDelete={setChatTimeline}
              apptId={appointment.id}
            />
            <ProgressStep
              className="appointment-timeline-event"
              id={`appointment-schedule-step`}
              titleId={`appointment-schedule-title`}
              aria-label="Appointment scheduled"
              style={{ position: "relative" }}
              icon={<ResourcesFullIcon color="#1d9a9f" />}
            >
              <ConversationMessage
                apptId={appointment.id}
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
