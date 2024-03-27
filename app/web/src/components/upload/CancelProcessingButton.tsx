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
import { Alert } from "@patternfly/react-core";
import { TimesIcon } from "@patternfly/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  cancelHandler: (awsRef: string) => Promise<void>;
}

export const CancelProcessingButton = ({
  awsRef,
  cancelHandler,
}: CancelProcessingButtonProps) => {
  const router = useRouter();

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = () => {
    setPending(true);
    cancelHandler(awsRef)
      .then(() => {
        setPending(false);
        router.push("/");
      })
      .catch((e) => {
        setPending(false);
        setError(e.message);
      });
  };

  return (
    <>
      <LoadingButton
        variant="warning"
        isLoading={pending}
        onClick={handleCancel}
        icon={<TimesIcon />}
        style={cancelButtonStyle}
      >
        Cancel Processing
      </LoadingButton>
      {error ? (
        <Alert variant="danger" title="Error" style={cancelAlertStyle}>
          {error}
        </Alert>
      ) : null}
    </>
  );
};
