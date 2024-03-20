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
import { JSONResponse } from "@lib/response";
import {
  Button,
  Form,
  ToggleGroup,
  ToggleGroupItem,
  Text,
  Panel,
  PanelMain,
  PanelMainBody,
  Icon,
  PanelFooter,
} from "@patternfly/react-core";
import { useRouter } from "next/navigation";
import style from "@assets/style";
// https://github.com/DeltaCircuit/react-media-recorder/issues/105
// was having a strange bug with this, but someone made a version
// specifically to fix the bug since the maintainers weren't fixing them
import { useReactMediaRecorder } from "react-media-recorder-2";
import React from "react";
import { CSS } from "@lib/utils";
import { UploadIcon } from "@patternfly/react-icons";
import { BsCameraVideo } from "react-icons/bs";

const recordVideoStyle: CSS = {
  margin: "0 auto",
  width: "100%",
  maxWidth: "35rem",
};

const ACCEPTED_MIME_TYPES = ["video/mp4", "video/x-msvideo", "video/quicktime"]; // mp4, avi, mov

/* CSS */

const formStyle: CSS = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  alignItems: "center",
};

const fileUploadStyle: CSS = {
  width: "max-content",
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
  });
  const videoStream = new MediaStream(stream.getVideoTracks());
  stateHandler(videoStream);
}

function destroyMediaStream(stream?: MediaStream | null) {
  if (!stream) return;
  stream.getTracks().forEach((track) => {
    track.stop();
  });
}

/* Components */

const LiveFeed = ({ stream }: { stream: MediaStream | null }) => {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream;
    }
  }, [stream]);
  return stream ? <video ref={ref} autoPlay style={recordVideoStyle} /> : null;
};

interface UploadVideoFormProps {
  apptId: number;
  onChange?: (videoFile: File) => void;
}

export const UploadVideoForm = ({ apptId, onChange }: UploadVideoFormProps) => {
  const router = useRouter();

  const [recordMode, setRecordMode] = useState<boolean>(false);
  const [localFile, setLocalFile] = useState<File>();
  const [recordFile, setRecordFile] = useState<File>();
  const [isPicked, setIsPicked] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<JSONResponse>();
  const [previewStream, setPreviewStream] = useState<MediaStream>();
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    previewStream: liveStream, // rename to liveStream as we have a different previewStream object for an actual preview
  } = useReactMediaRecorder({
    video: { frameRate: 24 },
    onStop: (_: string, blob: Blob) => {
      const f = new File([blob], "recorded.webm", { type: "video/webm" });
      setRecordFile(f);
    },
  }); // force a lower but still standard fps to improve performance

  useEffect(() => {
    if (recordMode) {
      setLocalFile(undefined);
      setIsPicked(false);
      initMediaStream(setPreviewStream);
    } else {
      destroyMediaStream(previewStream);
      setPreviewStream(undefined);
    }
  }, [recordMode]);

  useEffect(() => {
    if (onChange) {
      if (!recordMode && localFile) {
        onChange(localFile);
      } else if (recordMode && recordFile) {
        onChange(recordFile);
      }
    }
  }, [localFile, recordFile, recordMode]);

  const toggleRecordMode = () => {
    setRecordMode(!recordMode);
  };

  const onSubmitClick = async (e: any) => {
    if (
      ((!localFile || !isPicked) && !recordMode) ||
      (recordMode && !recordFile)
    ) {
      alert(
        "No file selected. Make sure you either upload or record a video and select the correct upload type.",
      );
      return;
    }

    try {
      const formData = new FormData();
      if (!recordMode && localFile) {
        formData.set("file", localFile);
      } else if (recordMode && recordFile) {
        formData.set("file", recordFile);
      }
      formData.set("apptId", apptId.toString());
      // formData.set("blurFaces", blurFaceCheck.toString());
      // const processed: any = [];
      // regions.forEach((r: RegionInfo) => {
      //   processed.push({
      //     origin: [Math.round(r.pos.x * width), Math.round(r.pos.y * height)],
      //     width: Math.round(r.dim.width * width),
      //     height: Math.round(r.dim.height * height),
      //   });
      // });
      // formData.set("regions", JSON.stringify(processed));
      // console.log("processed regions ", JSON.stringify(processed));

      const response = await fetch("/api/video/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Error in upload response.");
        throw Error(await response.text());
      } else if (response.status === 200) {
        const json = await response.clone().json();

        setResponseData(json);

        setTimeout(() => {
          router.push(
            `/upload/status/${encodeURIComponent(json.data?.filePath)}?apptId=${apptId}`,
          );
        }, 150);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const onRecordClick = (_: React.MouseEvent<HTMLButtonElement>) => {
    if (status !== "recording") {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] as File;
    if (!ACCEPTED_MIME_TYPES.includes(f.type)) {
      alert("You must select an *.mp4, *.avi, or *.mov file");
      return;
    }
    setLocalFile(f);
    setIsPicked(true);
  };

  return (
    <Panel aria-label="Video uploader">
      <PanelMain>
        <PanelMainBody>
          {responseData?.data?.success ? (
            <p className="success">Upload successful. Redirecting...</p>
          ) : (
            <>
              {recordMode && status === "stopped" ? (
                <video src={mediaBlobUrl} controls style={recordVideoStyle} />
              ) : null}
              {recordMode && status !== "stopped" ? ( // if status is stopped, we'll be displaying the recorded video so disable the live feed
                <LiveFeed
                  stream={status === "recording" ? liveStream : previewStream!}
                />
              ) : null}
              {recordMode ? (
                <Button
                  variant="danger"
                  onClick={onRecordClick}
                  aria-label="Record video"
                >
                  {(() => {
                    switch (status) {
                      case "recording":
                        return "Stop recording";
                      case "stopped":
                        return "Re-record";
                      default:
                        return "Start recording";
                    }
                  })()}
                </Button>
              ) : null}
              <Form
                aria-label="Video upload form"
                onSubmit={(e) => e.preventDefault()}
                style={formStyle}
              >
                {!recordMode ? (
                  <input
                    className="file-input"
                    type="file"
                    alt="file upload"
                    accept={ACCEPTED_MIME_TYPES.toString()}
                    onChange={handleLocalFileChange}
                    style={fileUploadStyle}
                  />
                ) : null}
              </Form>
            </>
          )}
        </PanelMainBody>
      </PanelMain>
      <PanelFooter style={panelFooterStyle}>
        <ToggleGroup aria-label="Video mode toggle group">
          <ToggleGroupItem
            icon={<UploadIcon />}
            text="Upload video"
            buttonId="toggle-upload-mode"
            isSelected={!recordMode}
            onChange={toggleRecordMode}
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
            onChange={toggleRecordMode}
          />
        </ToggleGroup>
      </PanelFooter>
    </Panel>
  );
};
export default UploadVideoForm;
