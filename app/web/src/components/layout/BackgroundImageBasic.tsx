import React from "react";
import Image from 'next/image';
import background from "@assets/background.png";

const backgroundImageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  position: "fixed",
  zIndex: -1,
  margin: 0,
};

export const BackgroundImageBasic: React.FunctionComponent = () => (
  <Image
    src={background.src}
    alt="Background"
    width={background.width} 
    height={background.height} 
    style={backgroundImageStyle}
  />
);
