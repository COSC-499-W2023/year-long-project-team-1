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
import { CSS } from "@lib/utils";
import { TimesIcon } from "@patternfly/react-icons";
import { useCallback, useState } from "react";

const cancelButtonStyle: CSS = {
  margin: "2rem 0",
};

const cancelAlertStyle: CSS = {
  margin: "1rem 0",
  maxWidth: "92.5%",
  width: "30rem",
};

interface CancelProcessingButtonProps {
  awsRef: string;
  apptId: number;
  onSuccess?: () => void;
  onFailure?: (err: Error) => void;
}

export const CancelProcessingButton = ({
  awsRef,
  apptId,
  onSuccess,
  onFailure,
}: CancelProcessingButtonProps) => {
  const [pending, setPending] = useState(false);

  const handleCancel = useCallback(
    (_e: React.MouseEvent) => {
      setPending(true);
      fetch(`/api/video/${encodeURIComponent(awsRef)}?appt=${apptId}`, {
        method: "DELETE",
      })
        .then((resp) => {
          setPending(false);
          if (!resp.ok) {
            throw new Error(`Request failed with status ${resp.status}`);
          }
          onSuccess && onSuccess();
        })
        .catch((err) => {
          onFailure && onFailure(err);
        })
        .finally(() => {
          setPending(false);
        });
    },
    [setPending, onSuccess, onFailure, awsRef, apptId],
  );

  return (
    <LoadingButton
      variant="warning"
      isLoading={pending}
      onClick={handleCancel}
      icon={<TimesIcon />}
      style={cancelButtonStyle}
    >
      Cancel Processing
    </LoadingButton>
  );
};
