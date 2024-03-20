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

const uploadButtonStyle: CSS = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  margin: "0 auto",
  cursor: "pointer",
};

interface UploadWizardProps {
  onFinish: () => void;
}

export const UploadWizard = ({ onFinish }: UploadWizardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [finalizing, setFinalizing] = useState(false);

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
          <WizardStep name="Upload your video" id="video-upload-step">
            Upload Step
          </WizardStep>
          <WizardStep name="Select privacy options" id="video-upload-blurring">
            Blurring options
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
