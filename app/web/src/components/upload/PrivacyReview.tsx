"use client";

import { Hint } from "@components/form/Hint";
import { SelectedItem } from "@components/form/SelectedItem";
import { CSS } from "@lib/utils";
import {
  Panel,
  PanelHeader,
  PanelMain,
  PanelMainBody,
  Title,
} from "@patternfly/react-core";

/* Constants */

const finalizationHint: string = `After you click "Process Video", you will have another chance to see the processed video before your video is actually sent.`;

/* CSS */

const panelMainStyle: CSS = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2rem",
};

const selectedItemStyle: CSS = {
  justifyContent: "flex-start",
};

/* Components */

interface PrivacyReviewProps {
  facialBlurringEnabled: boolean;
  customBlurringEnabled: boolean;
  numRegions?: number;
  videoUrl?: string | null;
  children?: React.ReactNode;
}

export const PrivacyReview = ({
  facialBlurringEnabled,
  customBlurringEnabled,
  numRegions,
  videoUrl,
  children,
}: PrivacyReviewProps) => {
  return (
    <Panel>
      <PanelHeader>
        <Title headingLevel="h2" size="xl">
          Review your Selections
        </Title>
      </PanelHeader>
      <PanelMain>
        <PanelMainBody style={panelMainStyle}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <Title headingLevel="h3" size="lg">
              Your video:
            </Title>
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                style={{ width: "100%", height: "auto" }}
              />
            ) : (
              children
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              width: "100%",
            }}
          >
            <Title headingLevel="h3" size="lg">
              Your privacy options:
            </Title>
            <div style={{ margin: "0 auto" }}>
              <SelectedItem
                selected={facialBlurringEnabled}
                style={selectedItemStyle}
              >
                Facial blurring
              </SelectedItem>
              <SelectedItem
                selected={customBlurringEnabled}
                style={selectedItemStyle}
              >
                Custom blurring {numRegions ? `(${numRegions} regions)` : ""}
              </SelectedItem>
            </div>
          </div>
          <Hint message={finalizationHint} />
        </PanelMainBody>
      </PanelMain>
    </Panel>
  );
};
