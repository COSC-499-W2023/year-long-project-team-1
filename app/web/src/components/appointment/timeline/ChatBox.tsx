"use client";

import LoadingButton from "@components/form/LoadingButton";
import {
  InputGroup,
  InputGroupItem,
  TextInput,
  Title,
} from "@patternfly/react-core";
import React, { FormEvent, useEffect, useState } from "react";

const chatboxContainerStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

const inputGroupStyles: React.CSSProperties = {
  display: "flex",
};

const buttonStyles: React.CSSProperties = {
  alignSelf: "flex-end",
  borderTopLeftRadius: "0",
  borderBottomLeftRadius: "0",
};

interface ChatBoxProps {
  contactName?: string;
  value: string;
  onSend?: (message: string) => void;
}

export const ChatBox = ({ contactName, value, onSend }: ChatBoxProps) => {
  const [message, setMessage] = useState(value);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [message]);

  useEffect(() => {
    setMessage(value);
  }, [value]);

  const handleChangeMessage = (
    _: FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setMessage(value);
  };

  const handleSend = () => {
    if (!message) {
      return;
    }
    setPending(true);
    if (onSend) {
      onSend(message);
    }

    const timeout = setTimeout(() => {
      setPending(false);
      clearTimeout(timeout);
    }, 10000); // 10 seconds
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
