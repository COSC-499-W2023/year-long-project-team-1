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
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  ToggleGroup,
  ToggleGroupItem,
  Panel,
  PanelMain,
  PanelMainBody,
  Icon,
  PanelHeader,
  FileUpload,
  ButtonSize,
} from "@patternfly/react-core";
// https://github.com/DeltaCircuit/react-media-recorder/issues/105
// was having a strange bug with this, but someone made a version
// specifically to fix the bug since the maintainers weren't fixing them
import { StatusMessages, useReactMediaRecorder } from "react-media-recorder-2";
import React from "react";
import { CSS } from "@lib/utils";
import { UploadIcon } from "@patternfly/react-icons";
import { BsCameraVideo } from "react-icons/bs";
import { FileUploader } from "./FileUploader";

// const ACCEPTED_MIME_TYPES = ["video/mp4", "video/x-msvideo", "video/quicktime"]; // mp4, avi, mov

// patternfly doesn't expose their file upload accept parameters, which is dumb
const ACCEPTED_FILE_TYPES = [".mp4", ".avi", ".mov"];

/* CSS */

const panelStyle: CSS = {
  height: "100%",
};

const formStyle: CSS = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  alignItems: "center",
};

const fileUploadStyle: CSS = {
  width: "max-content",
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

/* Support functions */

async function initMediaStream(stateHandler: (stream: MediaStream) => void) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  // no need to only get video tracks since the <video> preview can be muted i.e. capture audio without playing it back
  stateHandler(stream);
}

function destroyMediaStream(stream?: MediaStream | null) {
  if (!stream) return;
  stream.getTracks().forEach((track) => {
    track.stop();
  });
}

function recordButtonText(status: StatusMessages): string {
  switch (status) {
    case "recording":
      return "Stop recording";
    case "stopped":
      return "Re-record";
    case "idle":
    default:
      return "Start recording";
  }
}

/* Components */

interface LiveFeedProps {
  stream?: MediaStream | null;
}

const LiveFeed = ({ stream }: LiveFeedProps) => {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream;
    }
  }, [stream]);
  return stream ? (
    <video
      ref={ref}
      style={videoPlayerStyle}
      autoPlay
      disablePictureInPicture
      muted
    />
  ) : null;
};

interface UploadVideoFormProps {
  children?: React.ReactNode;
  isCancelled?: boolean;
  existingVideoFile?: File | null;
  onChange?: (videoFile?: File | null) => void;
}

export const UploadVideoForm = ({
  children,
  isCancelled,
  existingVideoFile,
  onChange,
}: UploadVideoFormProps) => {
  const [recordMode, setRecordMode] = useState<boolean>(false);
  const [localFile, setLocalFile] = useState<File | null>(
    existingVideoFile ?? null,
  );
  const [recordFile, setRecordFile] = useState<File | null>(null);
  const [previewStream, setPreviewStream] = useState<MediaStream>();

  const {
    status: recordingStatus, // renamed for semantic clarity
    startRecording,
    stopRecording,
    mediaBlobUrl,
    previewStream: liveStream, // rename to liveStream as we have a different previewStream object for an actual preview
  } = (() => {
    const isWindowDefined = typeof window !== "undefined";
    if (!isWindowDefined) {
      return {
        status: "idle" as StatusMessages,
        startRecording: () => {},
        stopRecording: () => {},
        mediaBlobUrl: "",
        previewStream: null,
      };
    }

    const mediaRecorderState = useReactMediaRecorder({
      video: { frameRate: 24 },
      onStop: (_: string, blob: Blob) => {
        const f = new File([blob], "recorded.webm", { type: "video/webm" });
        setRecordFile(f);
      },
    }); // force a lower but still standard fps to improve performance
    return mediaRecorderState;
  })();

  useEffect(() => {
    if (recordMode) {
      setLocalFile(null);
      initMediaStream(setPreviewStream);
    } else {
      destroyMediaStream(previewStream);
      setPreviewStream(undefined);
    }
  }, [recordMode]);

  useEffect(() => {
    if (isCancelled) {
      setLocalFile(null);
      setRecordFile(null);
      destroyMediaStream(previewStream);
      setPreviewStream(undefined);
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

  const handleRecordClick = (_: React.MouseEvent<HTMLButtonElement>) => {
    if (recordingStatus !== "recording") {
      startRecording();
    } else {
      stopRecording();
    }
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
            <div style={recordingAreaStyle}>
              {recordingStatus === "stopped" ? (
                // if status is stopped, we'll be displaying the recorded video so disable the live feed
                <video src={mediaBlobUrl} controls style={videoPlayerStyle} />
              ) : (
                <LiveFeed
                  stream={
                    recordingStatus === "recording" ? liveStream : previewStream
                  }
                />
              )}
              <Button
                variant="danger"
                onClick={handleRecordClick}
                aria-label="Record video"
              >
                {recordButtonText(recordingStatus)}
              </Button>
            </div>
          ) : (
            <Form
              aria-label="Video upload form"
              onSubmit={(e) => e.preventDefault()}
              style={formStyle}
            >
              <FileUploader
                acceptedFileTypes={ACCEPTED_FILE_TYPES}
                style={fileUploadStyle}
                onUpload={(file) => setLocalFile(file)}
                onClear={handleClearFileUpload}
              />
              {localFile ? (
                <video src={URL.createObjectURL(localFile)} controls />
              ) : null}
            </Form>
          )}
        </PanelMainBody>
      </PanelMain>
    </Panel>
  );
};
export default UploadVideoForm;
