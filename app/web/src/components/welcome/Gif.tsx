import React from "react";
import { CSS } from "@lib/utils";
import gifimage from "@assets/welcome.gif"; // Path may vary based on your project structure
import Image from "next/image";

const gifContainerStyle: CSS = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-75%, -%)",
};

const Gif: React.FC = () => {
    return (
        <div style={gifContainerStyle}>
            <Image
                src={gifimage.src}
                alt="Background"
                width={gifimage.width}
                height={gifimage.height}
            />
        </div>
    );
};

export default Gif;
