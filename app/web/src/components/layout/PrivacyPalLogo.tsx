"use client";

import Image from "next/image";
import logo from "@assets/dark_logo_no_name.png";

interface PrivacyPalLogoProps {
  w?: number;
  h?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function PrivacyPalLogo({
  w,
  h,
  className,
  style,
}: PrivacyPalLogoProps) {
  return (
    <Image
      src={logo.src}
      alt="PrivacyPal Shield Logo"
      width={w ?? 96}
      height={h ?? 96}
      style={style}
      className={className}
    />
  );
}
