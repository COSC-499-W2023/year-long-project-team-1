"use client";
import {
  ProgressStepper,
  ProgressStep,
  Card,
  CardTitle,
  CardBody,
  CardHeader,
} from "@patternfly/react-core";
import { ConversationMessage } from "./ConversationMessage";
import React from "react";
import { ResourcesFullIcon, UserIcon } from "@patternfly/react-icons";
import { ChatBox } from "./ChatBox";

const messageStyle: React.CSSProperties = {
  position: "relative",
  top: "-50%",
  display: "flex",
  flexDirection: "column",
  // padding: "1rem",
  width: "100%",
  transform: "translate(0, calc(-50% + 0.5rem))",
};

const timelineStyles: React.CSSProperties = {
  position: "relative",
  padding: "0rem 1rem",
};

export const AppointmentTimeline = () => {
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

  const progressSteps = senderNames.map((senderName, index) => (
    <ProgressStep
      className="appointment-timeline-step"
      key={index}
      // description={times[index]}
      id={`step-${index}`}
      titleId={`step-${index}-title`}
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
    <Card>
      <CardHeader>
        <ChatBox
          contactName={placeholderData.contact.name}
          onSend={(msg) => console.log(msg)}
        />
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
  );
};
