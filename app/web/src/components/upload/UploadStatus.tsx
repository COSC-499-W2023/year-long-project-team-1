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

import Loading from "@app/loading";
import { VideoStatus } from "@lib/response";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UploadStatusProps {
  filename: string;
  apptId: string;
}

export const UploadStatus = ({ filename, apptId }: UploadStatusProps) => {
  const router = useRouter();
  const [status, setStatus] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("Processing...");

  const checkStatus = async () => {
    if (status) return;

    try {
      const response = await fetch(`/api/video/status?filename=${filename}`);

      if (response.status === 404) {
        setStatus(true);
        setStatusMessage("File not found.");
        return;
      }

      if (response.ok) {
        const json = await response.json();
        if (json.data.message === VideoStatus.DONE) {
          setStatusMessage("Processing complete!");
          setStatus(true);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkStatus();
    }, 5000);
    if (status) clearInterval(interval);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (status) router.push(`/upload/review/${filename}?apptId=${apptId}`);
  }, [status]);

  return (
    <>
      <Loading />
      <p>{statusMessage}</p>
    </>
  );
};
