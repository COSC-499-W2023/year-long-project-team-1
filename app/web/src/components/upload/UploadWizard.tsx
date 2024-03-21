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
import { useState } from "react";
import { VideoBlurringPanel } from "./blurring/VideoBlurringPanel";
import UploadVideoForm from "./UploadVideoForm";
import { RegionInfo } from "react-region-select-2";

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

/* Components */

interface UploadWizardProps {
  apptId: number;
  onFinish: () => void;
}

export const UploadWizard = ({ apptId, onFinish }: UploadWizardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [blurredRegions, setBlurredRegions] = useState<RegionInfo[]>([]);
  const [facialBlurringEnabled, setFacialBlurringEnabled] = useState(false);
  const [customBlurringEnabled, setCustomBlurringEnabled] = useState(false);

  const handleUpdateVideoFile = (file?: File) => {
    setVideoFile(file ?? null);
  };

  const handleFinalize = async () => {
    setFinalizing(true);
    onFinish();
  };

  return (
    <>
      <Card>
        <CardBody>
          <span style={uploadButtonStyle} onClick={() => setDialogOpen(true)}>
            <Icon size="lg">
              <UploadIcon />
            </Icon>
            <Text>Upload a video</Text>
          </span>
        </CardBody>
      </Card>
      <Modal
        isOpen={dialogOpen}
        showClose={false}
        aria-label="Wizard modal"
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
              onSetFaceBlurring={setFacialBlurringEnabled}
              onSetCustomBlurring={setCustomBlurringEnabled}
              onChange={setBlurredRegions}
            >
              {videoFile ? (
                <video
                  src={URL.createObjectURL(videoFile)}
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
            Review
          </WizardStep>
        </Wizard>
      </Modal>
    </>
  );
};
