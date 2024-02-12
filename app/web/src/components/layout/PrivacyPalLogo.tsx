"use client";

import Image from "next/image";
import logo_dark from "@assets/dark_logo_no_name.png";
import logo_light from "@assets/light_logo_no_name.png";

interface PrivacyPalLogoProps {
  w?: number;
  h?: number;
  className?: string;
  style?: React.CSSProperties;
  dark?: boolean;
}

export default function PrivacyPalLogo({
  w,
  h,
  className,
  style,
  dark = true,
}: PrivacyPalLogoProps) {
  return (
    <Image
      src={dark ? logo_dark.src : logo_light.src}
      alt="PrivacyPal Shield Logo"
      width={w ?? 96}
      height={h ?? 96}
      style={style}
      className={className}
    />
  );
}
