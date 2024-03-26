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

import {
  Icon,
  Label,
  Panel,
  PanelMain,
  PanelMainBody,
  Title,
} from "@patternfly/react-core";

import placeholderImage from "@assets/blurring_placeholder.png";
import RegionSelect, { RegionInfo } from "react-region-select-2";
import { useEffect, useState } from "react";
import { CSS } from "@lib/utils";
import { InfoCircleIcon } from "@patternfly/react-icons";
import { BlurSettingsSwitch } from "./BlurSettingsSwitch";
import { Hint } from "@components/form/Hint";
import Image from "next/image";
import { FaRegFaceSmileBeam } from "react-icons/fa6";
import { PiSelection } from "react-icons/pi";

export const DEFAULT_REGION_NUM = 5;

const faceBlurringTooltip: string = `After you click Upload & Review, facial recognition and motion tracking will be used to apply a blur to all faces found in your video. You will be able to review the processed video before finalizing the upload.`;
const customBlurringTooltip: string = `Select up to ${DEFAULT_REGION_NUM} static areas on your video to blur. Areas you select will be blurred for the entire video. The applied blur will not follow the motion of the video.`;

const faceBlurringHint: string = `Facial blurring will be automatically applied when your video is processed.`;
const customBlurringHint: string = `Click and drag to choose up to ${DEFAULT_REGION_NUM} fixed areas of the frame to be blurred. Please note that rendered blur may not exactly match that shown here.`;

const regionSelectorStyle: CSS = {
  position: "relative",
  width: "100%",
  flexGrow: "0",
  border: "1px solid #000",
};

const regionSelectionStyle: CSS = {
  transition: "opacity 200ms ease-in-out",
  borderColor: "var(--pf-v5-global--palette--orange-300)",
  borderWidth: "0.1rem",
  borderStyle: "solid",
  backdropFilter: "blur(1rem)",
};

const placeholderImageStyle: CSS = {
  objectFit: "cover",
  height: "100%",
};

const panelMainStyle: CSS = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "1rem",
  overflowY: "hidden",
};

const selectorColumn: CSS = {};

const blurSettingsRow: CSS = {
  display: "flex",
  flexDirection: "row",
  gap: "1rem",
};

const blurSettingsSwitches: CSS = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  flexBasis: "50%",
};

const blurredRegionsColumn: CSS = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  flexBasis: "50%",
};

const regionLabelStyle: CSS = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  color: "white",
  textShadow: "0 0 0.25rem #000",
  fontSize: "1.5rem",
  pointerEvents: "none",
  fontWeight: "bold",
  WebkitTextStroke: "1px black",
  whiteSpace: "nowrap",
};

interface VideoBlurringPanelProps {
  regions?: RegionInfo[];
  children?: React.ReactNode;
  facialBlurringEnabled?: boolean;
  customBlurringEnabled?: boolean;
  onSetFaceBlurring?: (value: boolean) => void;
  onSetCustomBlurring?: (value: boolean) => void;
  onChange?: (regions: RegionInfo[]) => void;
}

export const VideoBlurringPanel = ({
  regions,
  children,
  facialBlurringEnabled,
  customBlurringEnabled,
  onSetFaceBlurring,
  onSetCustomBlurring,
  onChange,
}: VideoBlurringPanelProps) => {
  const [blurredRegions, setBlurredRegions] = useState<RegionInfo[]>(
    regions ?? [],
  );
  const [faceBlurringOn, setFaceBlurringOn] = useState(
    facialBlurringEnabled ?? true,
  );
  const [customBlurringOn, setCustomBlurringOn] = useState(
    customBlurringEnabled ?? true,
  );

  useEffect(() => {
    if (onChange) {
      onChange(blurredRegions);
    }
  }, [blurredRegions]);

  useEffect(() => {
    if (onSetFaceBlurring) {
      onSetFaceBlurring(faceBlurringOn);
    }
  }, [faceBlurringOn]);

  useEffect(() => {
    if (onSetCustomBlurring) {
      onSetCustomBlurring(customBlurringOn);
    }
  }, [customBlurringOn]);

  const handleRegionSelect = (regions: RegionInfo[]): void => {
    setBlurredRegions(regions);
  };

  const handleRegionDelete = (index: number): void => {
    setBlurredRegions((regions) => regions.filter((_, i) => i !== index));
  };

  const handleChangeFaceBlurring = (value: boolean) => {
    setFaceBlurringOn(value);
  };

  const handleChangeCustomBlurring = (value: boolean) => {
    setCustomBlurringOn(value);
  };

  const localRegionStyles: CSS = {
    ...regionSelectionStyle,
    opacity: customBlurringOn ? "1" : "0",
    pointerEvents: customBlurringOn ? "auto" : "none",
  };

  const localRegionSelectorStyles: CSS = {
    ...regionSelectorStyle,
    pointerEvents: customBlurringOn ? "auto" : "none",
    cursor: customBlurringOn ? "crosshair" : "default",
  };

  const renderRegionLabels = (region: RegionInfo) => {
    return (
      <Title
        headingLevel="h3"
        size="md"
        style={regionLabelStyle}
      >{`#${region.data.index + 1}`}</Title>
    );
  };

  const RegionsList = () => {
    const regionLabels = blurredRegions.map((_, index) => {
      let localLabelStyle: CSS = {
        display: "flex",
        justifyContent: "space-between",
        transition: "height 200ms ease-in-out",
      };

      return (
        <Label
          key={`blur-region-${index}`}
          color={customBlurringOn ? "orange" : "grey"}
          icon={<InfoCircleIcon />}
          onClose={
            customBlurringOn
              ? () => {
                  handleRegionDelete(index);
                }
              : undefined
          }
          style={localLabelStyle}
        >
          {`Blur #${index + 1}${customBlurringOn ? "" : " (Not applied)"}`}
        </Label>
      );
    });

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Title headingLevel="h3" size="md">
          Selected regions:
        </Title>
        <hr style={{ borderWidth: "0.5px" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            overflowY: "auto",
          }}
        >
          {regionLabels.length > 0 ? regionLabels : "No regions selected."}
        </div>
      </div>
    );
  };

  return (
    <Panel>
      <PanelMain>
        <PanelMainBody style={panelMainStyle}>
          <div style={selectorColumn}>
            <RegionSelect
              style={localRegionSelectorStyles}
              regionStyle={localRegionStyles}
              regions={blurredRegions}
              maxRegions={DEFAULT_REGION_NUM}
              onChange={handleRegionSelect}
              regionRenderer={renderRegionLabels}
            >
              {children ? (
                children
              ) : (
                <Image
                  style={placeholderImageStyle}
                  src={placeholderImage.src}
                  alt="Blurring tool Placeholder Image"
                  width={placeholderImage.width}
                  height={placeholderImage.height}
                />
              )}
            </RegionSelect>
          </div>
          <div style={blurSettingsRow}>
            <div style={blurSettingsSwitches}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <BlurSettingsSwitch
                  switchAriaLabel="Enable Facial Blurring"
                  text="Enable Facial Blurring"
                  // hint={faceBlurringTooltip}
                  value={faceBlurringOn}
                  icon={
                    <Icon>
                      <FaRegFaceSmileBeam />
                    </Icon>
                  }
                  onChange={handleChangeFaceBlurring}
                />
                <Hint message={faceBlurringHint} />
              </div>
            </div>
            <div style={blurredRegionsColumn}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <BlurSettingsSwitch
                  switchAriaLabel="Enable Static Blurring"
                  text="Enable Static Blurring"
                  // hint={customBlurringTooltip}
                  value={customBlurringOn}
                  icon={
                    <Icon>
                      <PiSelection />
                    </Icon>
                  }
                  onChange={handleChangeCustomBlurring}
                />
                <Hint message={customBlurringHint} />
              </div>
              <RegionsList />
            </div>
          </div>
        </PanelMainBody>
      </PanelMain>
    </Panel>
  );
};
