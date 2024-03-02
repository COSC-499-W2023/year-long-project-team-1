"use client";

import LoadingButton from "@components/form/LoadingButton";
import {
  InputGroup,
  InputGroupItem,
  TextArea,
  Button,
  TextInput,
} from "@patternfly/react-core";
import { AngleDoubleRightIcon } from "@patternfly/react-icons";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

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
  };

  const sendButton = (
    <LoadingButton
      onClick={handleSend}
      style={buttonStyles}
      isLoading={pending}
      disabled={!message}
    >
      {/* <AngleDoubleRightIcon /> */}
      Send
    </LoadingButton>
  );

  return (
    <InputGroup style={inputGroupStyles}>
      <InputGroupItem isFill>
        <TextInput
          name="chat-message"
          id="chat-message"
          aria-label="text input with button"
          placeholder={`Send a message to ${contactName}...`}
          value={message}
          onChange={handleChangeMessage}
        />
      </InputGroupItem>
      <InputGroupItem>{sendButton}</InputGroupItem>
    </InputGroup>
  );
};
