"use client";

import LoadingButton from "@components/form/LoadingButton";
import {
  InputGroup,
  InputGroupItem,
  TextArea,
  Button,
} from "@patternfly/react-core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const inputGroupStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "stretch",
  padding: "1rem",
  gap: "1rem",
};

const textAreaStyles: React.CSSProperties = {
  minHeight: "8rem",
};

const buttonStyles: React.CSSProperties = {
  alignSelf: "flex-end",
};

interface ChatBoxProps {
  contactName?: string;
  onSend?: (message: string) => void;
}

export const ChatBox = ({ contactName, onSend }: ChatBoxProps) => {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (message) {
      setPending(false);
    }
  }, [message]);

  const handleChangeMessage = (_: React.ChangeEvent, value: string) => {
    setMessage(value);
  };

  const handleSend = () => {
    setPending(true);
    if (!message) {
      setPending(false);
      return;
    }
    if (onSend) {
      onSend(message);
      router.refresh();
    }
  };

  return (
    <InputGroup style={inputGroupStyles}>
      <InputGroupItem isFill>
        <TextArea
          name="inputGroup-with-textarea"
          id="inputGroup-with-textarea"
          aria-label="textarea with button"
          resizeOrientation="vertical"
          placeholder={`Send a message to ${contactName}...`}
          style={textAreaStyles}
          value={message}
          onChange={handleChangeMessage}
        />
      </InputGroupItem>
      <InputGroupItem>
        <LoadingButton
          onClick={handleSend}
          style={buttonStyles}
          isLoading={pending}
        >
          Send
        </LoadingButton>
      </InputGroupItem>
    </InputGroup>
  );
};
