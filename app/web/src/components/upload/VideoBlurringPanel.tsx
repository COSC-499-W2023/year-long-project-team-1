"use client";

import {
  Flex,
  FlexItem,
  Label,
  Panel,
  PanelFooter,
  PanelHeader,
  PanelMain,
  PanelMainBody,
  Switch,
  Title,
  Tooltip,
} from "@patternfly/react-core";

import testImage from "@assets/background.png";
import RegionSelect, { RegionInfo } from "react-region-select-2";
import { useEffect, useState } from "react";
import { CSS } from "@lib/utils";
import { InfoCircleIcon } from "@patternfly/react-icons";
import { Hint } from "@components/form/Hint";

export const DEFAULT_REGION_NUM = 5;

const regionSelectorStyle: CSS = {
  position: "relative",
  width: "100%",
  height: "100%",
  border: "1px solid #000",
};

const regionSelectionStyle: CSS = {
  borderColor: "var(--pf-v5-global--palette--orange-300)",
  borderWidth: "0.1rem",
  borderStyle: "solid",
  backdropFilter: "blur(1rem)",
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

interface BlurSettingsHeadingProps {
  switchAriaLabel: string;
  text?: string;
  hint?: string;
  value?: boolean;
  onChange: (value: boolean) => void;
}

const BlurSettingsSwitch = ({
  switchAriaLabel,
  text,
  hint,
  value,
  onChange,
}: BlurSettingsHeadingProps) => {
  const handleChange = (value: boolean) => {
    onChange(value);
  };

  const settingsSwitch = (
    <Switch
      id={
        switchAriaLabel
          .split(" ")
          .filter((word) => word.length > 0)
          .map((word) => word.toLowerCase())
          .join("-") + "-switch"
      }
      isChecked={value}
      onChange={(_, value) => handleChange(value)}
      ouiaId={switchAriaLabel}
      aria-label={switchAriaLabel}
    />
  );

  return (
    <span
      style={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}
    >
      <Title headingLevel="h3" size="md" style={{ whiteSpace: "nowrap" }}>
        {text}
      </Title>
      {hint ? (
        <Tooltip content={<Hint message={hint} style={{ color: "white" }} />}>
          {settingsSwitch}
        </Tooltip>
      ) : (
        settingsSwitch
      )}
    </span>
  );
};

interface VideoBlurringPanelProps {
  children?: React.ReactNode;
  onChange?: (regions: RegionInfo[]) => void;
}

export const VideoBlurringPanel = ({
  children,
  onChange,
}: VideoBlurringPanelProps) => {
  const [regions, setRegions] = useState<RegionInfo[]>([]);
  const [faceBlurringOn, setFaceBlurringOn] = useState(true);
  const [customBlurringOn, setCustomBlurringOn] = useState(true);

  useEffect(() => {
    if (onChange && regions.length > 0) {
      onChange(regions);
    }
  }, [regions]);

  const handleRegionSelect = (regions: RegionInfo[]): void => {
    setRegions(regions);
  };

  const handleRegionDelete = (index: number): void => {
    setRegions((regions) => regions.filter((_, i) => i !== index));
  };

  const handleChangeFaceBlurring = (value: boolean) => {
    setFaceBlurringOn(value);
    console.log("Face Blurring: ", value);
  };

  const handleChangeCustomBlurring = (value: boolean) => {
    setCustomBlurringOn(value);
    console.log("Custom Blurring: ", value);
  };

  const localRegionStyles: CSS = {
    ...regionSelectionStyle,
    visibility: customBlurringOn ? "visible" : "hidden",
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
        style={{
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
        }}
      >{`${region.data.index + 1}`}</Title>
    );
  };

  const RegionsList = () => {
    const regionLabels = regions.map((_, index) => (
      <Label
        color={customBlurringOn ? "orange" : "grey"}
        icon={<InfoCircleIcon />}
        onClose={customBlurringOn ? () => handleRegionDelete(index) : undefined}
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {`Blur #${index + 1}${customBlurringOn ? "" : " (Not applied)"}`}
      </Label>
    ));

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {regionLabels}
      </div>
    );
  };

  return (
    <Panel>
      <PanelHeader>
        <Title headingLevel="h3" size="lg">
          Video Blurring
        </Title>
      </PanelHeader>
      <PanelMain>
        <PanelMainBody style={panelMainStyle}>
          <div style={selectorColumn}>
            <RegionSelect
              style={localRegionSelectorStyles}
              regionStyle={localRegionStyles}
              regions={regions}
              maxRegions={DEFAULT_REGION_NUM}
              onChange={handleRegionSelect}
              regionRenderer={renderRegionLabels}
            >
              {children ? (
                children
              ) : (
                <img src={testImage.src} alt="Test image" />
              )}
            </RegionSelect>
          </div>
          <div style={regionsColumn}>
            <BlurSettingsSwitch
              switchAriaLabel="Enable Face Blurring"
              text="Enable Face Blurring"
              hint="After you click Upload, facial recognition will be used to identify faces and apply a blur to all faces found. You will be able to review the processed video before finalizing the upload."
              value={faceBlurringOn}
              onChange={handleChangeFaceBlurring}
            />
            <br />
            <BlurSettingsSwitch
              switchAriaLabel="Enable Static Blurring"
              text="Enable Static Blurring"
              hint={`Select up to ${DEFAULT_REGION_NUM} static areas on your video to blur. Areas you select will be blurred for the entire video. The applied blur will not follow the motion of the video.`}
              value={customBlurringOn}
              onChange={handleChangeCustomBlurring}
            />
            <br />
            <br />
            <RegionsList />
          </div>
        </PanelMainBody>
      </PanelMain>
      <PanelFooter></PanelFooter>
    </Panel>
  );
};
