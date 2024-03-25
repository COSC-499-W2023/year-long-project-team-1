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

import { UploadVideoForm } from "@components/upload/UploadVideoForm";
import { UploadWizard } from "@components/upload/UploadWizard";
import { Metadata } from "next";
import { useRef } from "react";

export const metadata: Metadata = {
  title: "Upload Video",
};

export default function UploadPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  if (!searchParams) {
    return <p>Appointment not found.</p>;
  }

  const { apptId } = searchParams;

  console.log("apptId", apptId);

  if (!apptId || typeof apptId !== "string") {
    return <p>Appointment not found.</p>;
  }

  const apptIdNumber = parseInt(apptId);

  if (isNaN(apptIdNumber)) {
    return <p>Appointment not found.</p>;
  }
  return <UploadWizard apptId={apptIdNumber} onFinish={() => null} />;
}
