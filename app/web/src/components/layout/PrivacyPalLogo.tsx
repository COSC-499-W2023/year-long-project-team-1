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
