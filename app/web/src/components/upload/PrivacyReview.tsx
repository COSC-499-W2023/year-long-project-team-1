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

const privacyOptionsHint: string = `These are the options you selected on the last step.`;
const videoPreviewHint: string = `A reminder of the video you uploaded or recorded. This is for your reference and the video has not yet been processed.`;
const finalizationHint: string = `After you click "Process Video", you will have another chance to see the video with your selected privacy options applied before your video is actually sent.`;

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
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              width: "100%",
            }}
          >
            <div>
              <Title headingLevel="h3" size="lg">
                Your privacy options:
              </Title>
              <Hint message={privacyOptionsHint} />
            </div>
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
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <div>
              <Title headingLevel="h3" size="lg">
                Your chosen video:
              </Title>
              <Hint message={videoPreviewHint} />
            </div>
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
          <Hint message={finalizationHint} />
        </PanelMainBody>
      </PanelMain>
    </Panel>
  );
};
