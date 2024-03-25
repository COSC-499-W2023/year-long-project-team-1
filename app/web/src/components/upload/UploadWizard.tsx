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
  Card,
  CardBody,
  Icon,
  Modal,
  ModalVariant,
  Text,
  Wizard,
  WizardStep,
} from "@patternfly/react-core";
import { UploadIcon } from "@patternfly/react-icons";
import { useEffect, useRef, useState } from "react";
import { VideoBlurringPanel } from "./blurring/VideoBlurringPanel";
import UploadVideoForm from "./UploadVideoForm";
import { RegionInfo } from "react-region-select-2";
import { useRouter } from "next/navigation";
import { PrivacyReview } from "./PrivacyReview";

/* Constants */

const step1Title: string = "Upload or record your video";
const step2Title: string = "Select privacy options";
const step3Title: string = "Review";

/* CSS */

const uploadButtonStyle: CSS = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  margin: "0 auto",
  cursor: "pointer",
};

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
  onFinish: () => void;
}

export const UploadWizard = ({ apptId, onFinish }: UploadWizardProps) => {
  const router = useRouter();
  // refs
  const blurredVideoRef = useRef<HTMLVideoElement>(null);
  // wizard
  const [dialogOpen, setDialogOpen] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  // upload
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploadCancelled, setUploadCancelled] = useState(false);
  // blurring
  const [blurredRegions, setBlurredRegions] = useState<RegionInfo[]>([]);
  const [videoWidth, setVideoWidth] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);
  const [facialBlurringEnabled, setFacialBlurringEnabled] = useState(true);
  const [customBlurringEnabled, setCustomBlurringEnabled] = useState(true);

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoUrl(url);

      if (blurredVideoRef.current) {
        blurredVideoRef.current.src = url;
      }
    } else {
      setVideoUrl(null);
    }
  }, [videoFile]);

  useEffect(() => {
    if (!blurredVideoRef.current) return;

    const video = blurredVideoRef.current;

    const handleMetadataLoaded = () => {
      console.log(
        "Video metadata loaded:",
        video.videoWidth,
        video.videoHeight,
      );
      setVideoWidth(video.videoWidth);
      setVideoHeight(video.videoHeight);
    };

    if (video.readyState >= 1) {
      handleMetadataLoaded();
    } else {
      video.onloadedmetadata = handleMetadataLoaded;
    }

    // Clean up function
    return () => {
      video.onloadedmetadata = null;
    };
  }, [blurredVideoRef.current]);

  useEffect(() => {
    if (blurredRegions.length > 0) {
      setCustomBlurringEnabled(true);
    } else {
      setCustomBlurringEnabled(false);
    }
  }, [blurredRegions.length]);

  const handleUpdateVideoFile = (file?: File | null) => {
    setVideoFile(file ?? null);
  };

  const handleFinalize = async () => {
    setFinalizing(true);
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
        console.log("Blurred regions:", { processed });
        formData.set("regions", JSON.stringify(processed));
      }

      const response = await fetch("/api/video/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Error in upload response.");
        throw Error(await response.text());
      }

      const { data } = await response.json();

      onFinish();

      // clear resources used by the video preview
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }

      setTimeout(() => {
        router.push(
          `/upload/status/${encodeURIComponent(data.filePath)}?apptId=${apptId}`,
        );
      }, 150);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setFinalizing(false);
    }
  };

  const handleWizardClose = () => {
    setDialogOpen(false);
    setUploadCancelled(true);
  };

  const selectedVideo = videoUrl ? (
    <video
      ref={blurredVideoRef}
      src={videoUrl}
      controls={false}
      style={blurPreviewVideoStyle}
    />
  ) : null;

  return (
    <>
      <Card>
        <CardBody>
          <span style={uploadButtonStyle} onClick={() => setDialogOpen(true)}>
            <Icon size="lg">
              <UploadIcon />
            </Icon>
            <Text>Record or upload a video</Text>
          </span>
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
        <Wizard onClose={handleWizardClose}>
          <WizardStep
            name={step1Title}
            id="video-upload-step"
            footer={{
              nextButtonProps: {
                isAriaDisabled: !videoFile,
              },
            }}
          >
            <UploadVideoForm
              existingVideoFile={videoFile}
              isCancelled={uploadCancelled}
              onChange={handleUpdateVideoFile}
            />
          </WizardStep>
          <WizardStep name={step2Title} id="video-upload-blurring">
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
            name={step3Title}
            id="video-upload-review"
            footer={{
              nextButtonText: "Process Video",
              onNext: handleFinalize,
              nextButtonProps: {
                isLoading: finalizing,
              },
            }}
          >
            <PrivacyReview
              facialBlurringEnabled={facialBlurringEnabled}
              customBlurringEnabled={customBlurringEnabled}
              numRegions={blurredRegions.length}
              videoUrl={videoUrl}
            >
              {selectedVideo}
            </PrivacyReview>
          </WizardStep>
        </Wizard>
      </Modal>
    </>
  );
};
