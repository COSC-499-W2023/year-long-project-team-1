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
// @ts-ignore
import ReactRegionSelect from 'react-region-select';
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

const recordVideoStyle: CSS = {
  margin: "0 auto",
  width: "100%",
  maxWidth: "35rem",
};

interface UploadVideoFormProps {
  apptId: number;
}

export const UploadVideoForm = ({ apptId }: UploadVideoFormProps) => {
  const router = useRouter();

  const [recordMode, setUploadChecked] = useState<boolean>(false);

  const [localFile, setLocalFile] = useState<File>();
  const [recordFile, setRecordFile] = useState<File>();
  const [isPicked, setIsPicked] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<JSONResponse>();
  const [previewStream, setPreviewStream] = useState<MediaStream>();
  const acceptedMimeTypes = ["video/mp4", "video/x-msvideo", "video/quicktime"]; // mp4, avi, mov
  const [blurFaceCheck, setBlurFacesCheck] = React.useState<boolean>(true);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    const initialState = true;
    setBlurFacesCheck(initialState);
  }, []);

  const handleSwitchChanged = () => {
    setUploadChecked(!recordMode);
    // try get camera/mic permissions to show live feed before starting recording
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const videoStream = new MediaStream(stream.getVideoTracks());
        setPreviewStream(videoStream); // get both video and audio permissions but only set video stream to preview so we don't get audio feedback
      });
  };

  const onRecordStop = (blobUrl: string, blob: Blob) => {
    const f = new File([blob], "recorded.webm", { type: "video/webm" });
    setRecordFile(f);
  };

  const handleChange = (
    _event: React.FormEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    setBlurFacesCheck((prevCheck) => !prevCheck);
    console.log("Blur face check: " + (!blurFaceCheck).toString());
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
      regions.forEach((r: any)=>{
        processed.push({
          "origin": [Math.round((r.x) * 12.80), Math.round((r.y) * 7.20)],
          "width": Math.round((r.width) * 12.80),
          "height": Math.round((r.height) * 7.20)
        })
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

  const LiveFeed = ({ stream }: { stream: MediaStream | null }) => {
    const ref = useRef<HTMLVideoElement>(null);
    useEffect(() => {
      if (ref.current && stream) {
        ref.current.srcObject = stream;
      }
    }, [stream]);
    return stream ? (
      <video ref={ref} autoPlay style={recordVideoStyle} />
    ) : null;
  };

  // const regionRenderer = (regionProps: any) => {
	// 	if (!regionProps.isChanging) {
	// 		return (
	// 			<div style={{ position: 'absolute', right: 0, bottom: '-1.5em' }}>
	// 				<select onChange={(event) => changeRegionData(regionProps.index, event)} value={regionProps.data.dataType}>
	// 					<option value='1'>Green</option>
	// 					<option value='2'>Blue</option>
	// 					<option value='3'>Red</option>
	// 				</select>
	// 			</div>
	// 		);
	// 	}
	// }

  const onChange = (regions:any) => {
		setRegions(regions);
    console.log("regions", regions);
	}
  const regionStyle = {
    background: 'rgba(255, 0, 0, 0.5)'
  };

  // const changeRegionData = (index : any, event:any) => {
	// 	const region = regions[index];
	// 	let color;
	// 	switch (event.target.value) {
	// 	case '1':
	// 		color = 'rgba(0, 255, 0, 0.5)';
	// 		break;
	// 	case '2':
	// 		color = 'rgba(0, 0, 255, 0.5)';
	// 		break;
	// 	case '3':
	// 		color = 'rgba(255, 0, 0, 0.5)';
	// 		break;
	// 	default:
	// 		color = 'rgba(0, 0, 0, 0.5)';
	// 	}

  //   // @ts-ignore
	// 	region.data.regionStyle = {
	// 		background: color
	// 	};
	// 	onChange([
	// 		...regions.slice(0, index),
	// 		// objectAssign({}, region, {
	// 		// 	data: objectAssign({}, region.data, { dataType: event.target.value })
	// 		// }),
	// 		// ...this.state.regions.slice(index + 1)
	// 	]);
	// }

  return (
    <Card
      style={{ ...style.card, position: "relative" }}
      aria-label="Video uploader"
    >
      <CardTitle component="h1">Upload a Video</CardTitle>
      <CardBody>
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
              {localFile ? (
                <ReactRegionSelect constraint regions={regions} regionStyle={regionStyle} maxRegions={5} style={{ border: '1px solid black' }} onChange={onChange}>
                <video
                  // controls
                  autoPlay={false}
                  style={videoReviewStyle.videoPlayer}
                >
                  <source src={URL.createObjectURL(localFile)} />
                </video>
                </ReactRegionSelect>
              ) : null}
              <ActionList style={style.actionList}>
                <ActionListItem>
                  <Switch
                    className="record-switch"
                    id="mode-switch"
                    label="Mode: Record video"
                    labelOff="Mode: Upload video"
                    isChecked={recordMode}
                    onChange={handleSwitchChanged}
                    isReversed
                  />
                </ActionListItem>

                <ActionListItem>
                  <Switch
                    id="simple-switch"
                    className="blur-switch"
                    label="Face blurring: Off"
                    labelOff="Face blurring: On"
                    isChecked={!blurFaceCheck}
                    onChange={handleChange}
                    ouiaId="UploadVideoForm"
                    isReversed
                  />
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
      </CardBody>
    </Card>
  );
};
export default UploadVideoForm;
