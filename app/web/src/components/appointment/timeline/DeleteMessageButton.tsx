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

import { TimesIcon } from "@patternfly/react-icons";
import { CSS } from "@lib/utils";
import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
  Tooltip,
} from "@patternfly/react-core";
import { useRouter } from "next/navigation";
import { useState } from "react";

const deleteButtonStyle: CSS = {
  zIndex: 2,
  cursor: "pointer",
  color: "var(--pf-v5-global--danger-color--100)",
};

interface DeleteMessageButtonProps {
  awsRef?: string;
  messageId?: number;
  onDelete?: () => void;
}

export const DeleteMessageButton = ({
  awsRef,
  messageId,
  onDelete,
}: DeleteMessageButtonProps) => {
  const router = useRouter();

  const [error, setError] = useState<string>("");

  const handleDelete = async () => {
    try {
      const fetchTarget = new URL("/api/timeline/event", window.location.href);
      if (messageId)
        fetchTarget.searchParams.append("messageId", messageId.toString());
      if (awsRef) fetchTarget.searchParams.append("awsRef", awsRef);

      const response = await fetch(fetchTarget.href, {
        method: "DELETE",
      });

      if (!response.ok) {
        setError("Failed to delete message. Please try again.");
        return;
      }

      if (onDelete) {
        onDelete();
      }
    } catch (err: any) {
      setError(
        "Sorry, there was an error deleting your message. Please try again.",
      );
    }
  };

  const timelineEventType = awsRef
    ? "video"
    : messageId
      ? "message"
      : "appointment event";

  return (
    <>
      <Tooltip content={`Delete ${timelineEventType}`}>
        <span style={deleteButtonStyle} onClick={handleDelete}>
          <TimesIcon />
        </span>
      </Tooltip>
      <AlertGroup isToast isLiveRegion>
        {error ? (
          <Alert
            variant="danger"
            title={`Error deleting ${timelineEventType}`}
            actionClose={
              <AlertActionCloseButton
                title="Close alert"
                variantLabel="Close event deletion error"
                onClose={() => setError("")}
              />
            }
          >
            {error}
          </Alert>
        ) : null}
      </AlertGroup>
    </>
  );
};
