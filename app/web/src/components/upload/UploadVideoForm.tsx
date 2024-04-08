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
import { useEffect, useState } from "react";
import {
  Form,
  ToggleGroup,
  ToggleGroupItem,
  Panel,
  PanelMain,
  PanelMainBody,
  Icon,
  PanelHeader,
  Stack,
  StackItem,
} from "@patternfly/react-core";
// https://github.com/DeltaCircuit/react-media-recorder/issues/105
// was having a strange bug with this, but someone made a version
// specifically to fix the bug since the maintainers weren't fixing them
// import { StatusMessages, useReactMediaRecorder } from "react-media-recorder-2";
import React from "react";
import { CSS } from "@lib/utils";
import { UploadIcon } from "@patternfly/react-icons";
import { BsCameraVideo } from "react-icons/bs";
import { FileUploader } from "./FileUploader";
import dynamic from "next/dynamic";

/**
 * Dynamically import the client side media recorder so it doesn't break SSR.
 */
const ClientSideMediaRecorder = dynamic(
  () =>
    import("@components/upload/ClientSideMediaRecorder").then(
      (mod) => mod.ClientSideMediaRecorder,
    ),
  { ssr: false },
);

// patternfly doesn't expose their file upload accept parameters, which is dumb
const ACCEPTED_FILE_TYPES = [".mp4", ".avi", ".mov"];

/* CSS */

const panelStyle: CSS = {
  height: "100%",
};

const videoPlayerStyle: CSS = {
  width: "100%",
  height: "100%",
};

const recordingAreaStyle: CSS = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  alignItems: "center",
  justifyContent: "center",
};

const panelFooterStyle: CSS = {
  display: "flex",
  gap: "1rem",
  justifyContent: "center",
  alignItems: "center",
};

/* Components */

interface UploadVideoFormProps {
  children?: React.ReactNode;
  isCancelled?: boolean;
  existingVideoFile?: File | null;
  onChange?: (videoFile?: File | null) => void;
}

export const UploadVideoForm = ({
  isCancelled,
  existingVideoFile,
  onChange,
}: UploadVideoFormProps) => {
  const [recordMode, setRecordMode] = useState<boolean>(false);
  const [localFile, setLocalFile] = useState<File | null>(
    existingVideoFile ?? null,
  );
  const [recordFile, setRecordFile] = useState<File | null>(null);

  useEffect(() => {
    if (recordMode) {
      setLocalFile(null);
    } else {
      setRecordFile(null);
    }
  }, [recordMode]);

  useEffect(() => {
    if (isCancelled) {
      setLocalFile(null);
      setRecordFile(null);
    }
  }, [isCancelled]);

  useEffect(() => {
    if (onChange) {
      if (!recordMode) {
        onChange(localFile);
      } else if (recordMode) {
        onChange(recordFile);
      }
    }
  }, [localFile, recordFile, recordMode]);

  const handleClearFileUpload = () => {
    setLocalFile(null);
  };

  const handleStopRecording = (_: string, blob: Blob) => {
    const f = new File([blob], "recorded.webm", { type: "video/webm" });
    setRecordFile(f);
  };

  return (
    <Panel aria-label="Video uploader" style={panelStyle}>
      <PanelHeader style={panelFooterStyle}>
        <ToggleGroup aria-label="Video mode toggle group">
          <ToggleGroupItem
            icon={<UploadIcon />}
            text="Upload video"
            buttonId="toggle-upload-mode"
            isSelected={!recordMode}
            onChange={() => setRecordMode(false)}
          />
          <ToggleGroupItem
            icon={
              <Icon>
                <BsCameraVideo />
              </Icon>
            }
            text="Record video"
            buttonId="toggle-record-mode"
            isSelected={recordMode}
            onChange={() => setRecordMode(true)}
          />
        </ToggleGroup>
      </PanelHeader>
      <PanelMain>
        <PanelMainBody>
          {recordMode ? (
            <ClientSideMediaRecorder
              frameRate={24}
              onStop={handleStopRecording}
              style={recordingAreaStyle}
              videoPlayerStyle={videoPlayerStyle}
            />
          ) : (
            <Stack hasGutter>
              <StackItem>
                <FileUploader
                  acceptedFileTypes={ACCEPTED_FILE_TYPES}
                  onUpload={(file) => setLocalFile(file)}
                  onClear={handleClearFileUpload}
                />
              </StackItem>
              {localFile ? (
                <StackItem>
                  <video src={URL.createObjectURL(localFile)} controls />
                </StackItem>
              ) : null}
            </Stack>
          )}
        </PanelMainBody>
      </PanelMain>
    </Panel>
  );
};
export default UploadVideoForm;
