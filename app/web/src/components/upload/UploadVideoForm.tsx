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
  Card,
  CardTitle,
  CardBody,
  ActionList,
  ActionListItem,
  Form,
  Radio,
} from "@patternfly/react-core";
import { useRouter } from "next/navigation";
import style from "@assets/style";
// https://github.com/DeltaCircuit/react-media-recorder/issues/105
// was having a strange bug with this, but someone made a version
// specifically to fix the bug since the maintainers weren't fixing them
import { useReactMediaRecorder } from "react-media-recorder-2";

export const UploadVideoForm = () => {
  const router = useRouter();

  const [uploadChecked, setUploadChecked] = useState<boolean>(true);
  const handleUploadChanged = () => {
    setUploadChecked(!uploadChecked);
  };
  const onRecordStop = (blobUrl: string, blob: Blob) => {
    const f = new File([blob], "recorded.mp4", { type: "video/mp4" });
    setRecordFile(f);
  };

  const [localFile, setLocalFile] = useState<File>();
  const [recordFile, setRecordFile] = useState<File>();
  const [file, setFile] = useState<File>();
  const [isPicked, setIsPicked] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<JSONResponse>();
  const acceptedMimeTypes = ["video/mp4", "video/x-msvideo", "video/quicktime"]; // mp4, avi, mov
  const { status, startRecording, stopRecording, mediaBlobUrl, previewStream } =
    useReactMediaRecorder({
      video: { frameRate: 24 },
      blobPropertyBag: { type: "video/mp4" },
      onStop: onRecordStop,
    }); // force a lower but still standard fps to improve performance

  const onSubmitClick = async (e: any) => {
    if (uploadChecked) {
      setFile(localFile);
    } else {
      setFile(recordFile);
    }
    // these ^ aren't updating before this if check here? but only the first time, the next submit click it works just fine (????)
    if (!file || (!isPicked && uploadChecked)) {
      console.log(uploadChecked, file, localFile, recordFile);
      alert(
        "No file selected. Make sure you either upload or record a video and select the correct upload type.",
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.set("file", file);

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
            `/upload/status/${encodeURIComponent(json.data?.filePath)}`,
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
    if (!acceptedMimeTypes.includes(f.type)) {
      alert("You must select an *.mp4, *.avi, or *.mov file");
      return;
    }
    setLocalFile(f);
    setIsPicked(true);
  };

  const LiveFeed = ({ stream }: { stream: MediaStream | null }) => {
    const ref = useRef<HTMLVideoElement>(null);
    useEffect(() => {
      if (ref.current && stream) {
        ref.current.srcObject = stream;
      }
    }, [stream]);
    return stream ? <video ref={ref} autoPlay /> : null;
  };

  return (
    <Card style={style.card} aria-label="Video uploader">
      <CardTitle component="h1">Upload a Video</CardTitle>
      <CardBody>
        {responseData?.data?.success ? (
          <p className="success">Upload successful. Redirecting...</p>
        ) : (
          <Form
            aria-label="Video upload form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="file-input"
              type="file"
              alt="file upload"
              accept={acceptedMimeTypes.toString()}
              onChange={onFileChanged}
            />
            {status === "stopped" ? (
              <video src={mediaBlobUrl} controls />
            ) : null}
            {status === "recording" ? (
              <LiveFeed stream={previewStream} />
            ) : null}
            <ActionList style={style.actionList}>
              <ActionListItem>
                <Radio
                  isChecked={uploadChecked}
                  onChange={handleUploadChanged}
                  name="uploadType"
                  id="upload"
                  label="Uploaded"
                />
              </ActionListItem>
              <ActionListItem>
                <Radio
                  isChecked={!uploadChecked}
                  onChange={handleUploadChanged}
                  name="uploadType"
                  id="record"
                  label="Recorded"
                />
              </ActionListItem>
              <ActionListItem>
                <Button
                  variant="primary"
                  type="submit"
                  onClick={onSubmitClick}
                  aria-label="Submit video"
                >
                  Submit video
                </Button>
              </ActionListItem>
              <ActionListItem>
                <Button
                  variant="danger"
                  onClick={onRecordClick}
                  aria-label="Record video"
                >
                  {status !== "recording" ? "Record video" : "Stop recording"}
                </Button>
              </ActionListItem>
            </ActionList>
          </Form>
        )}
      </CardBody>
    </Card>
  );
};
export default UploadVideoForm;
