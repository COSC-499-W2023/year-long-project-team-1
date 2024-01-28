import React from "react";
import background from "@assets/background.png";

const backgroundImageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "fixed",
  zIndex: -1,
  margin: 0,
};

export const BackgroundImageBasic: React.FunctionComponent = () => (
  <img src={background.src} alt="Background" style={backgroundImageStyle} />
);
