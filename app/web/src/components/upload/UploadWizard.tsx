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

  const blurredVideoRef = useRef<HTMLVideoElement>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [blurredRegions, setBlurredRegions] = useState<RegionInfo[]>([]);
  const [videoWidth, setVideoWidth] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);
  const [facialBlurringEnabled, setFacialBlurringEnabled] = useState(false);
  const [customBlurringEnabled, setCustomBlurringEnabled] = useState(false);

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

  const handleUpdateVideoFile = (file?: File) => {
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
        onEscapePress={() => setDialogOpen(false)}
        variant={ModalVariant.medium}
      >
        <Wizard onClose={() => setDialogOpen(false)}>
          <WizardStep
            name="Upload or record your video"
            id="video-upload-step"
            footer={{
              nextButtonProps: {
                isAriaDisabled: !videoFile,
              },
            }}
          >
            <UploadVideoForm apptId={apptId} onChange={handleUpdateVideoFile} />
          </WizardStep>
          <WizardStep name="Select privacy options" id="video-upload-blurring">
            <VideoBlurringPanel
              regions={blurredRegions}
              onSetFaceBlurring={setFacialBlurringEnabled}
              onSetCustomBlurring={setCustomBlurringEnabled}
              onChange={setBlurredRegions}
            >
              {videoUrl ? (
                <video
                  ref={blurredVideoRef}
                  src={videoUrl}
                  controls={false}
                  style={blurPreviewVideoStyle}
                />
              ) : null}
            </VideoBlurringPanel>
          </WizardStep>
          <WizardStep
            name="Review processed video"
            id="video-upload-review"
            footer={{
              nextButtonText: "Submit video",
              onNext: handleFinalize,
              nextButtonProps: {
                isLoading: finalizing,
              },
            }}
          >
            <pre>
              {JSON.stringify(
                {
                  facialBlurringEnabled,
                  customBlurringEnabled,
                  blurredRegions,
                  videoWidth,
                  videoHeight,
                },
                null,
                2,
              )}
            </pre>
          </WizardStep>
        </Wizard>
      </Modal>
    </>
  );
};
