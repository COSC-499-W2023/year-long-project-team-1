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

import { VideoStatus } from "@lib/response";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UploadStatusProps {
  appointmentId: string;
  filename: string;
}

export const UploadStatus = ({ filename, appointmentId }: UploadStatusProps) => {
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

          setTimeout(() => {
            router.push(`/upload/review/${filename}`);
          }, 150);
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

  return (
    <div>
      <p>Status: {statusMessage}</p>
    </div>
  );
};
