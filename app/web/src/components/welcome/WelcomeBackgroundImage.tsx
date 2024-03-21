import React from "react";
import { CSS } from "@lib/utils";
import background from "@assets/welcomebackground.svg";
import Image from "next/image";
import GifImage from "./GifImage";

const containerStyle: CSS = {
    position: "fixed",
    zIndex: 0,
    width: "100vw",
    height: "100vh",
    top: 0,
    overflow: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const imageWrapperStyle: CSS = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
};

export const WelcomeBackgroundImage: React.FunctionComponent = () => {
    return (
        <div style={containerStyle}>
            <div style={imageWrapperStyle}>
                <Image
                    src={background.src}
                    alt="Background"
                    height={background.height}
                    width={background.width}
                    layout="responsive"
                />
            </div>
            <GifImage />
        </div>
    );
};
