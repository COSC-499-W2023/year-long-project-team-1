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

import { ErrorView } from "@components/ErrorView";
import { VideoStatus } from "@lib/response";
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  Spinner,
} from "@patternfly/react-core";
import { CheckIcon } from "@patternfly/react-icons";
import { useCallback, useEffect, useState } from "react";
import { CancelProcessingButton } from "./CancelProcessingButton";

interface UploadStatusProps {
  shouldStart?: boolean;
  filename: string;
  apptId: number;
  interval?: number;
  onReady?: () => void;
  onCancel?: () => void;
  onError?: (err: Error) => void;
}

export const UploadStatus = ({
  shouldStart,
  filename,
  interval = 5000,
  apptId,
  onReady,
  onCancel,
  onError,
}: UploadStatusProps) => {
  const [canceling, setCanceling] = useState(false);
  const [done, setDone] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();

  const checkStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/video/status?filename=${filename}`);
      if (response.ok) {
        const json = await response.json();
        if (json.data.message === VideoStatus.DONE) {
          setDone(true);
          onReady && onReady();
        }
      } else {
        throw new Error(`Response with status code: ${response.status}`);
      }
    } catch (err: any) {
      setError(err);
      onError && onError(err);
    }
  }, [setDone, setError, onReady, filename]);

  useEffect(() => {
    let id: string | number | NodeJS.Timeout | undefined;
    if (shouldStart) {
      id = setInterval(checkStatus, interval);
    }

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, [checkStatus, shouldStart]);

  return (
    <>
      {error ? (
        <ErrorView
          title={"Failed to check video status"}
          message={error.message}
        />
      ) : done ? (
        <EmptyState>
          <EmptyStateHeader
            titleText="Success"
            headingLevel="h4"
            icon={<EmptyStateIcon icon={CheckIcon} color={"#3E8635"} />}
          />
          <EmptyStateBody>Processed video is ready for review.</EmptyStateBody>
        </EmptyState>
      ) : (
        <EmptyState>
          <EmptyStateHeader
            titleText={canceling ? "Canceling" : "Processing"}
            headingLevel="h4"
            icon={<EmptyStateIcon icon={Spinner} />}
          />
          {canceling ? null : (
            <EmptyStateBody>
              Video processing might take several minutes to complete.
            </EmptyStateBody>
          )}
          <EmptyStateFooter>
            <div onClick={() => setCanceling(true)}>
              <CancelProcessingButton
                awsRef={filename}
                apptId={apptId}
                onSuccess={onCancel}
                onFailure={onError}
              />
            </div>
          </EmptyStateFooter>
        </EmptyState>
      )}
    </>
  );
};
