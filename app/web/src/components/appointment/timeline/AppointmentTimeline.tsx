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
import React, { Suspense, useEffect, useState } from "react";
import { ResourcesFullIcon } from "@patternfly/react-icons";
import { ChatBox } from "./ChatBox";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { UserRole } from "@lib/userRole";
import { CognitoUser } from "@lib/cognito";
import Loading from "@app/loading";
import { revalidatePath } from "next/cache";
import { ConversationVideo } from "./ConversationVideo";

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
};

const alertStyles: React.CSSProperties = {
  marginTop: "1.5rem",
  zIndex: 2,
};

const videoPlayerStyles: React.CSSProperties = {
  position: "relative",
  top: "-0.5rem",
  marginBottom: "1rem",
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
  apptId: number;
  user: User;
  contact: CognitoUser;
  appointmentData?: AppointmentTimeline;
}

export const AppointmentTimeline = ({
  apptId,
  user,
  contact,
}: AppointmentTimelineProps) => {
  const router = useRouter();

  const [currentChatMessage, setCurrentChatMessage] = useState("");
  const [chatTimeline, setChatTimeline] = useState<AppointmentTimeline["data"]>(
    [],
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchChatTimelines(apptId)
      .then((data) => setChatTimeline(data.data))
      .catch((err) => setErrorMessage(err.message));
  }, [apptId]);

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

  const progressSteps = chatTimeline.map((chatEvent, index) => {
    const isMessage =
      chatEvent.message !== undefined && chatEvent.url === undefined;

    const eventContent = isMessage ? chatEvent.message : chatEvent.url;

    // if it is a video and you are not the client, then it is a contact message
    const isContactMessage =
      isMessage &&
      chatEvent.sender === contact.username &&
      user.role !== UserRole.CLIENT;

    const eventDate = new Date(chatEvent.time).toLocaleString();

    const eventComponent = isMessage ? (
      <ConversationMessage
        message={eventContent ?? ""}
        sender={chatEvent.sender ?? user.username}
        time={eventDate}
        style={messageStyle}
      />
    ) : (
      <ConversationVideo
        url={eventContent ?? ""}
        sender={chatEvent.sender ?? user.username}
        time={eventDate}
        style={videoPlayerStyles}
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
          contactName={placeholderData.contact.name}
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
        <ProgressStepper
          isVertical={true}
          isCenterAligned={false}
          aria-label="Basic progress stepper with alignment"
          style={finalizedTimelineStyles}
        >
          <Suspense fallback={<Loading />}>{progressSteps}</Suspense>
        </ProgressStepper>
      </CardBody>
    </Card>
  );
};
