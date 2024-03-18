"use client";

import {
  ActionGroup,
  ActionList,
  ActionListItem,
  Flex,
  FlexItem,
  Label,
  Panel,
  PanelFooter,
  PanelHeader,
  PanelMain,
  PanelMainBody,
  Text,
  Title,
  Tooltip,
} from "@patternfly/react-core";

import placeholderImage from "@assets/blurring_placeholder.png";
import RegionSelect, { RegionInfo } from "react-region-select-2";
import { useEffect, useState } from "react";
import { CSS } from "@lib/utils";
import { InfoCircleIcon } from "@patternfly/react-icons";
import LoadingButton from "@components/form/LoadingButton";
import { SelectedItem } from "@components/form/SelectedItem";
import { BlurSettingsSwitch } from "./BlurSettingsSwitch";
import { Hint } from "@components/form/Hint";
import Image from "next/image";

export const DEFAULT_REGION_NUM = 5;

const faceBlurringHint: string = `After you click Upload & Review, facial recognition and motion tracking will be used to apply a blur to all faces found in your video. You will be able to review the processed video before finalizing the upload.`;
const customBlurringHint: string = `Select up to ${DEFAULT_REGION_NUM} static areas on your video to blur. Areas you select will be blurred for the entire video. The applied blur will not follow the motion of the video.`;

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
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

const selectorColumn: CSS = {};

const regionsColumn: CSS = {
  display: "flex",
  flexDirection: "column",
  flexBasis: "20rem",
  width: "20rem",
  maxWidth: "max-content",
  padding: "1rem",
  gap: "0.25rem",
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
  onChange?: (regions: RegionInfo[]) => void;
}

export const VideoBlurringPanel = ({
  regions,
  children,
  onChange,
}: VideoBlurringPanelProps) => {
  const [blurredRegions, setBlurredRegions] = useState<RegionInfo[]>(
    regions ?? [],
  );
  const [faceBlurringOn, setFaceBlurringOn] = useState(true);
  const [customBlurringOn, setCustomBlurringOn] = useState(true);

  useEffect(() => {
    if (onChange) {
      onChange(blurredRegions);
    }
  }, [blurredRegions]);

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
    const regionLabels = blurredRegions.map((region, index) => {
      let localLabelStyle: CSS = {
        display: "flex",
        justifyContent: "space-between",
        transition: "height 200ms ease-in-out",
      };

      return (
        <Label
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
          Blurred Regions:
        </Title>
        <hr />
        {regionLabels.length > 0 ? regionLabels : "No regions selected."}
      </div>
    );
  };

  return (
    <Panel>
      <PanelHeader>
        <Title headingLevel="h3" size="xl">
          Video Privacy Settings
        </Title>
        <Hint
          message={"Choose different types of blur to apply to your video."}
        />
      </PanelHeader>
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
          <div style={regionsColumn}>
            <BlurSettingsSwitch
              switchAriaLabel="Enable Facial Blurring"
              text="Enable Facial Blurring"
              hint={faceBlurringHint}
              value={faceBlurringOn}
              onChange={handleChangeFaceBlurring}
            />
            <Hint
              message={
                "Facial blurring is automatically applied after video upload."
              }
            />
            <br />
            <BlurSettingsSwitch
              switchAriaLabel="Enable Static Blurring"
              text="Enable Static Blurring"
              hint={customBlurringHint}
              value={customBlurringOn}
              onChange={handleChangeCustomBlurring}
            />
            <Hint
              message={
                "Choose fixed areas of the frame to be blurred. Please note, rendered blurs may not exactly match those shown here."
              }
            />
            <br />
            <br />
            <RegionsList />
          </div>
        </PanelMainBody>
      </PanelMain>
      <PanelFooter>
        <ActionList>
          <ActionListItem>
            <LoadingButton variant="danger">Cancel</LoadingButton>
          </ActionListItem>
          <ActionListItem>
            <Tooltip
              content={
                <div>
                  <Text style={{ color: "white" }}>You have selected:</Text>
                  {!faceBlurringOn && !customBlurringOn ? (
                    <Text>No blurring.</Text>
                  ) : (
                    <>
                      <SelectedItem hide={!faceBlurringOn}>
                        Facial Blurring
                      </SelectedItem>
                      <SelectedItem hide={!customBlurringOn}>
                        Static Blurring
                      </SelectedItem>
                    </>
                  )}
                </div>
              }
            >
              <LoadingButton>Upload & Review</LoadingButton>
            </Tooltip>
          </ActionListItem>
        </ActionList>
      </PanelFooter>
    </Panel>
  );
};
