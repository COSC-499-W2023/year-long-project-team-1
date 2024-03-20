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
import ReactRegionSelect, { RegionInfo } from "react-region-select-2";
import { useEffect, useRef, useState } from "react";
import { JSONResponse } from "@lib/response";
import {
  Button,
  Card,
  CardTitle,
  CardBody,
  ActionList,
  ActionListItem,
  Form,
  Switch,
  ToggleGroup,
  ToggleGroupItem,
  Text,
  Panel,
  PanelMain,
  PanelMainBody,
} from "@patternfly/react-core";
import { useRouter } from "next/navigation";
import style from "@assets/style";
// https://github.com/DeltaCircuit/react-media-recorder/issues/105
// was having a strange bug with this, but someone made a version
// specifically to fix the bug since the maintainers weren't fixing them
import { useReactMediaRecorder } from "react-media-recorder-2";
import React from "react";
import { CSS } from "@lib/utils";
import LoadingButton from "@components/form/LoadingButton";
import { videoReviewStyle } from "@components/VideoReview";
import { CopyIcon, UndoIcon, ShareSquareIcon } from "@patternfly/react-icons";

const recordVideoStyle: CSS = {
  margin: "0 auto",
  width: "100%",
  maxWidth: "35rem",
};

const selectedRegionStyle: CSS = {
  backdropFilter: "blur(5px)",
};

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
}

export const UploadVideoForm = ({ apptId }: UploadVideoFormProps) => {
  const router = useRouter();

  const [recordMode, setRecordMode] = useState<boolean>(false);

  const [localFile, setLocalFile] = useState<File>();
  const [recordFile, setRecordFile] = useState<File>();
  const [isPicked, setIsPicked] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<JSONResponse>();
  const [previewStream, setPreviewStream] = useState<MediaStream>();
  const acceptedMimeTypes = ["video/mp4", "video/x-msvideo", "video/quicktime"]; // mp4, avi, mov
  const [blurFaceCheck, setBlurFacesCheck] = React.useState<boolean>(true);
  const [regions, setRegions] = useState<RegionInfo[]>([]);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const onRecordStop = (blobUrl: string, blob: Blob) => {
    const f = new File([blob], "recorded.webm", { type: "video/webm" });
    setRecordFile(f);
  };

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    previewStream: liveStream, // rename to liveStream as we have a different previewStream object for an actual preview
  } = useReactMediaRecorder({
    video: { frameRate: 24 },
    onStop: onRecordStop,
  }); // force a lower but still standard fps to improve performance

  const toggleRecordMode = () => {
    setRecordMode(!recordMode);
    // try get camera/mic permissions to show live feed before starting recording
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const videoStream = new MediaStream(stream.getVideoTracks());
        setPreviewStream(videoStream); // get both video and audio permissions but only set video stream to preview so we don't get audio feedback
      });
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
      formData.set("blurFaces", blurFaceCheck.toString());
      formData.set("apptId", apptId.toString());
      const processed: any = [];
      regions.forEach((r: RegionInfo) => {
        processed.push({
          origin: [Math.round(r.pos.x * width), Math.round(r.pos.y * height)],
          width: Math.round(r.dim.width * width),
          height: Math.round(r.dim.height * height),
        });
      });
      console.log("processed regions ", JSON.stringify(processed));
      formData.set("regions", JSON.stringify(processed));

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

  const onRecordClick = (e: any) => {
    if (status !== "recording") {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const onFileChanged = (e: any) => {
    const f = e.target.files?.[0] as File;
    // console.log("file ",f.mozFullPath);
    if (!acceptedMimeTypes.includes(f.type)) {
      alert("You must select an *.mp4, *.avi, or *.mov file");
      return;
    }
    setLocalFile(f);
    setIsPicked(true);
  };

  const videoMetadataLoaded = () => {
    const video = document.getElementById("video-element");
    if (video instanceof HTMLVideoElement) {
      // will always be yes, just need this so TS doesn't freak out
      setWidth(video.videoWidth / 100);
      setHeight(video.videoHeight / 100);
    }
  };

  return (
    <Panel
      style={{ ...style.card, position: "relative" }}
      aria-label="Video uploader"
    >
      <PanelMain>
        <PanelMainBody>
          {responseData?.data?.success ? (
            <p className="success">Upload successful. Redirecting...</p>
          ) : (
            <>
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
                  style={{ width: "max-content", margin: "0 auto" }}
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
              >
                {!recordMode ? (
                  <input
                    className="file-input"
                    type="file"
                    alt="file upload"
                    accept={acceptedMimeTypes.toString()}
                    onChange={onFileChanged}
                  />
                ) : null}
                <ActionList style={style.actionList}>
                  <ActionListItem>
                    <ToggleGroup aria-label="Text and icon toggle group">
                      <ToggleGroupItem
                        icon={<CopyIcon />}
                        text="Upload video"
                        buttonId="toggle-group-text-icons-1"
                        isSelected={!recordMode}
                        onChange={toggleRecordMode}
                      />
                      <ToggleGroupItem
                        icon={<UndoIcon />}
                        text="Record video"
                        buttonId="toggle-group-text-icons-2"
                        isSelected={recordMode}
                        onChange={toggleRecordMode}
                      />
                    </ToggleGroup>
                  </ActionListItem>
                  <ActionListItem>
                    <LoadingButton
                      variant="primary"
                      onClick={onSubmitClick}
                      aria-label="Submit video"
                    >
                      Submit video
                    </LoadingButton>
                  </ActionListItem>
                </ActionList>
              </Form>
            </>
          )}
        </PanelMainBody>
      </PanelMain>
    </Panel>
  );
};
export default UploadVideoForm;
