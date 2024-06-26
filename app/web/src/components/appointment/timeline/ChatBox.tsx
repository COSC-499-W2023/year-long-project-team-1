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

import LoadingButton from "@components/form/LoadingButton";
import {
  InputGroup,
  InputGroupItem,
  TextInput,
  Title,
} from "@patternfly/react-core";
import React, { FormEvent, useEffect, useState } from "react";
import { CSS } from "@lib/utils";
import { CognitoUser } from "@lib/cognito";
import { User } from "next-auth";

const chatboxContainerStyles: CSS = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

const inputGroupStyles: CSS = {
  display: "flex",
};

const buttonStyles: CSS = {
  alignSelf: "flex-end",
  borderTopLeftRadius: "0",
  borderBottomLeftRadius: "0",
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

export interface ChatMessage {
  id?: number;
  time: string;
  sender: string;
  message: string;
}

interface ChatBoxProps {
  apptId: number;
  fromUser: User;
  contactName?: string;
  onSend?: (msg: ChatMessage) => void;
  onError?: (error: string) => void;
}

export const ChatBox = ({
  apptId,
  fromUser,
  contactName,
  onSend,
  onError,
}: ChatBoxProps) => {
  const [message, setMessage] = useState<string>();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [message]);

  const handleChangeMessage = (
    _: FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setMessage(value);
  };

  const handleSend = async () => {
    if (!message) {
      return;
    }

    setPending(true);

    try {
      await sendChatMessage(apptId, message, fromUser);

      setMessage("");

      if (onSend) {
        const newMessage: ChatMessage = {
          time: new Date().toISOString(),
          sender: fromUser.username,
          message,
        };

        onSend(newMessage);
      }
    } catch (e: any) {
      console.error(e);
      if (onError) {
        onError(e.message);
      }
    } finally {
      // timeout to handle the stuck state
      const timeout = setTimeout(() => {
        setPending(false);
        clearTimeout(timeout);
      }, 10000); // 10 seconds
    }
  };

  const sendButton = (
    <LoadingButton
      onClick={handleSend}
      style={buttonStyles}
      isLoading={pending}
      disabled={!message}
    >
      Send
    </LoadingButton>
  );

  return (
    <div style={chatboxContainerStyles}>
      <Title headingLevel="h3">{`Send a message to ${contactName}:`}</Title>
      <InputGroup style={inputGroupStyles}>
        <InputGroupItem isFill>
          <TextInput
            name="chat-message"
            id="chat-message"
            aria-label="text input with button"
            placeholder="Type your message here..."
            value={message}
            onChange={handleChangeMessage}
          />
        </InputGroupItem>
        <InputGroupItem>{sendButton}</InputGroupItem>
      </InputGroup>
    </div>
  );
};
