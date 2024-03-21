import React from "react";
import { CSS } from "@lib/utils";
import gifimage from "@assets/welcome.gif";
import Image from "next/image";

const gifContainerStyle: CSS = {
  position: "absolute",
  top: "90%",
  left: "30%",
  transform: "translate(-75%, -75%)",
};

const GifImage: React.FC = () => {
  return (
    <div style={gifContainerStyle}>
      <Image
        src={gifimage.src}
        alt="Background"
        width={gifimage.width * 1.25}
        height={gifimage.height * 1.25}
      />
    </div>
  );
};

export default GifImage;
