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
import React, { useState } from "react";
import { ResourcesFullIcon } from "@patternfly/react-icons";
import { ChatBox } from "./ChatBox";
import { User } from "next-auth";
import { set } from "zod";
import { useRouter } from "next/navigation";

const messageStyle: React.CSSProperties = {
  position: "relative",
  top: "-50%",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  transform: "translate(0, calc(-50% + 0.5rem))",
};

const timelineStyles: React.CSSProperties = {
  position: "relative",
  padding: "0rem 1rem",
};

const placeholderData = {
  user: {
    name: "John Doe",
    email: "",
  },
  contact: {
    name: "Dr. Parker Peters",
  },
  time: new Date("3/1/2024, 1:17:35 AM").getTime(),
};

const alertGroupStyles: React.CSSProperties = {
  position: "relative",
  marginTop: "1.5rem",
};

const alertStyles: React.CSSProperties = {
  // position: "fixed",
  // bottom: "1rem",
  // right: "1rem",
  zIndex: 2,
};

async function sendChatMessage(apptId: number, message: string, user: User) {
  const response = await fetch(`/api/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ apptId, message }),
  });

  if (!response.ok) {
    throw new Error("Failed to send chat message.");
  }
}

interface AppointmentTimelineProps {
  apptId: number;
  user: User;
}

export const AppointmentTimeline = ({
  apptId,
  user,
}: AppointmentTimelineProps) => {
  const router = useRouter();

  const [currentChatMessage, setCurrentChatMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const senderNames = Array.from(
    { length: 20 },
    (_, i) => `${placeholderData[i % 2 === 0 ? "user" : "contact"].name}`,
  );
  const times = Array.from({ length: 20 }, (_, i) =>
    new Date().toLocaleString(),
  );

  const finalizedTimelineStyles: React.CSSProperties = {
    ...timelineStyles,
    transform: `translate(0, calc(${100 / times.length}% / 5 + 2rem))`,
  };

  const handleChatSend = async (message: string) => {
    try {
      console.log(message);
      setErrorMessage("");
      await sendChatMessage(apptId, message, user);
      setCurrentChatMessage("");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const progressSteps = senderNames.map((senderName, index) => (
    <ProgressStep
      className="appointment-timeline-event"
      key={index}
      id={`appointment-event-${index}`}
      titleId={`appointment-event-${index}-title`}
      aria-label={senderName}
      style={{ position: "relative" }}
      icon={index % 2 === 1 ? <ResourcesFullIcon color="#1d9a9f" /> : null}
    >
      <ConversationMessage
        message="Hello, I'm here for my appointment."
        sender={senderName}
        time={new Date(placeholderData.time).toLocaleString()}
        style={messageStyle}
      />
      <span>&nbsp;</span>
    </ProgressStep>
  ));

  return (
    <>
      <Card>
        <CardHeader>
          <ChatBox
            contactName={placeholderData.contact.name}
            value={currentChatMessage}
            onSend={handleChatSend}
          />
          <AlertGroup style={alertGroupStyles} isLiveRegion>
            {errorMessage ? (
              <Alert
                title="Error:"
                variant="danger"
                style={alertStyles}
                isInline
              >
                {errorMessage}
              </Alert>
            ) : null}
          </AlertGroup>
        </CardHeader>
        <CardBody style={{ position: "relative", top: "-1rem" }}>
          <ProgressStepper
            isVertical={true}
            isCenterAligned={false}
            aria-label="Basic progress stepper with alignment"
            style={finalizedTimelineStyles}
          >
            {progressSteps}
          </ProgressStepper>
        </CardBody>
      </Card>
    </>
  );
};
