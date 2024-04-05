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

import { CSS } from "@lib/utils";
import {
  Bullseye,
  Card,
  CardBody,
  CardHeader,
  Icon,
  Modal,
  ModalVariant,
  Split,
  SplitItem,
  Text,
  Wizard,
  WizardHeader,
  WizardStep,
} from "@patternfly/react-core";
import { UploadIcon } from "@patternfly/react-icons";
import { redirect, useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { RegionInfo } from "react-region-select-2";
import UploadVideoForm from "./UploadVideoForm";
import { VideoBlurringPanel } from "./blurring/VideoBlurringPanel";
import VideoReview from "@components/VideoReview";
import { UploadStatus } from "./UploadStatus";
import { PrivacyOptionReview } from "./PrivacyReview";

const blurPreviewVideoStyle: CSS = {
  pointerEvents: "none",
  display: "block",
};

/* Support functions */

interface APIBlurredRegion {
  origin: [number, number];
  width: number;
  height: number;
}

function mapBlurRegionsToAPI(
  regions: RegionInfo[],
  width: number,
  height: number,
): APIBlurredRegion[] {
  return regions.map((r: RegionInfo) => {
    const relativeX = (r.pos.x / 100) * width;
    const relativeY = (r.pos.y / 100) * height;
    const relativeWidth = (r.dim.width / 100) * width;
    const relativeHeight = (r.dim.height / 100) * height;
    return {
      origin: [Math.round(relativeX), Math.round(relativeY)],
      width: Math.round(relativeWidth),
      height: Math.round(relativeHeight),
    };
  });
}

/* Components */

interface UploadWizardProps {
  apptId: number;
  onFinish?: () => void;
}

export const UploadWizard = ({ apptId, onFinish }: UploadWizardProps) => {
  // refs
  const blurredVideoRef = useRef<HTMLVideoElement>(null);
  // wizard
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  // upload
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadCancelled, setUploadCancelled] = useState(false);
  const [processCancelled, setProcessCancelled] = useState(false);
  // blurring
  const [blurredRegions, setBlurredRegions] = useState<RegionInfo[]>([]);
  const [videoWidth, setVideoWidth] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);
  const [facialBlurringEnabled, setFacialBlurringEnabled] = useState(true);
  const [customBlurringEnabled, setCustomBlurringEnabled] = useState(false);

  // status
  const [reviewFilePath, setReviewFilePath] = useState("");

  const videoUrl = useMemo(() => {
    if (!videoFile) {
      return null;
    }
    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  const selectedVideo = useMemo(
    () =>
      videoUrl ? (
        <video
          ref={blurredVideoRef}
          src={videoUrl}
          controls={false}
          style={blurPreviewVideoStyle}
          onLoadedMetadata={(_) => {
            if (!blurredVideoRef.current) {
              return;
            }
            const video = blurredVideoRef.current;
            setVideoWidth(video.videoWidth);
            setVideoHeight(video.videoHeight);
          }}
        />
      ) : null,
    [videoUrl, blurredVideoRef],
  );

  const handleUpdateVideoFile = useCallback(
    (file?: File | null) => {
      setVideoFile(file ?? null);
    },
    [setVideoFile],
  );

  const handleUploadVideo = useCallback(async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", videoFile as Blob);
      formData.set("apptId", apptId.toString());
      formData.set("blurFaces", facialBlurringEnabled.toString());

      if (customBlurringEnabled) {
        const processed = mapBlurRegionsToAPI(
          blurredRegions,
          videoWidth,
          videoHeight,
        );
        formData.set("regions", JSON.stringify(processed));
      }

      const response = await fetch("/api/video/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw Error(await response.text());
      }

      const { data } = await response.json();
      setReviewFilePath(data.filePath);
      setProcessing(true);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setUploading(false);
    }
  }, [
    setUploading,
    setReviewFilePath,
    setProcessing,
    videoFile,
    apptId,
    facialBlurringEnabled,
    customBlurringEnabled,
    blurredRegions,
    videoHeight,
    videoWidth,
    videoUrl,
  ]);

  const handleWizardClose = useCallback(() => {
    // clear resources used by the video preview
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setDialogOpen(false);
    setUploadCancelled(true);
    if (processing) {
      // FIXME: Some some banner or notifications if delete fails
      fetch(`api/video/${encodeURIComponent(reviewFilePath)}}?appt=${apptId}`, {
        method: "DELETE",
      });
    }
    onFinish && onFinish();
  }, [
    setDialogOpen,
    setUploadCancelled,
    onFinish,
    processing,
    reviewFilePath,
    apptId,
    videoUrl,
  ]);

  const handleReviewSubmit = useCallback(
    (action: string) => {
      // FIXME: The appointment inbox is not updated
      return fetch("/api/video/review", {
        method: "POST",
        body: JSON.stringify({
          apptId: apptId,
          filename: reviewFilePath,
          action: action,
        }),
      });
    },
    [reviewFilePath],
  );

  return (
    <>
      <Card
        isClickable
        id="video-upload-btn"
        onClick={() => setDialogOpen(true)}
      >
        <CardHeader
          selectableActions={{
            selectableActionId: "video-upload-btn",
            selectableActionAriaLabelledby: "video-upload-btn",
            name: "video-upload-btn",
          }}
          style={{ height: "0" }}
        />
        <CardBody>
          <Bullseye>
            <Split hasGutter>
              <SplitItem>
                <Icon size="lg">
                  <UploadIcon />
                </Icon>
              </SplitItem>
              <SplitItem>
                <Text>Upload or record a video</Text>
              </SplitItem>
            </Split>
          </Bullseye>
        </CardBody>
      </Card>
      <Modal
        isOpen={dialogOpen}
        showClose={false}
        aria-label="Upload video wizard"
        hasNoBodyWrapper
        onEscapePress={handleWizardClose}
        variant={ModalVariant.medium}
      >
        <Wizard
          onStepChange={(_event, current, _prev) => {
            if (current.id == "video-processing") {
              handleUploadVideo();
            }
          }}
          onClose={handleWizardClose}
          header={
            <WizardHeader
              title="Video Submission"
              description="Please follow the below steps to submit a video."
              isCloseHidden
            />
          }
          isVisitRequired
        >
          <WizardStep
            name={"Upload or Recording a video"}
            id="video-upload-step"
            footer={{
              nextButtonProps: {
                isAriaDisabled: !videoFile,
              },
            }}
            isDisabled={uploading || processing}
          >
            <UploadVideoForm
              existingVideoFile={videoFile}
              isCancelled={uploadCancelled}
              onChange={handleUpdateVideoFile}
            />
          </WizardStep>
          <WizardStep
            name={"Select privacy options"}
            id="privacy-options"
            isDisabled={!videoFile || uploading || processing}
          >
            <VideoBlurringPanel
              regions={blurredRegions}
              facialBlurringEnabled={facialBlurringEnabled}
              customBlurringEnabled={customBlurringEnabled}
              onSetFaceBlurring={setFacialBlurringEnabled}
              onSetCustomBlurring={setCustomBlurringEnabled}
              onChange={setBlurredRegions}
            >
              {selectedVideo}
            </VideoBlurringPanel>
          </WizardStep>
          <WizardStep
            name={"Review options"}
            id="privacy-options-review"
            footer={{
              nextButtonText: "Process Video",
            }}
            isDisabled={!videoFile || uploading || processing}
          >
            <PrivacyOptionReview
              facialBlurringEnabled={facialBlurringEnabled}
              customBlurringEnabled={customBlurringEnabled}
              numRegions={blurredRegions.length}
              videoUrl={videoUrl}
            >
              {selectedVideo}
            </PrivacyOptionReview>
          </WizardStep>
          <WizardStep
            name={"Finalize the video"}
            id="video-processing"
            isDisabled={!videoFile}
            footer={{
              nextButtonText: "Submit",
              isCancelHidden: processing || uploading,
              isBackDisabled: true,
              isNextDisabled: processing || uploading || processCancelled,
              onNext: () =>
                handleReviewSubmit("accept").then(handleWizardClose),
              onClose: () => {
                if (!processing) {
                  handleWizardClose();
                  return;
                }
                handleReviewSubmit("reject").then(handleWizardClose);
              },
            }}
          >
            {!processing && !uploading && !processCancelled ? (
              <VideoReview videoId={reviewFilePath} apptId={apptId} />
            ) : (
              <Bullseye>
                <UploadStatus
                  filename={reviewFilePath}
                  apptId={apptId}
                  shouldStart={processing}
                  onReady={() => setProcessing(false)}
                  onCancel={() => {
                    setProcessing(false);
                    setProcessCancelled(true);
                  }}
                  onError={(err) => {
                    console.error(err);
                    setProcessing(false);
                  }}
                />
              </Bullseye>
            )}
          </WizardStep>
        </Wizard>
      </Modal>
    </>
  );
};
