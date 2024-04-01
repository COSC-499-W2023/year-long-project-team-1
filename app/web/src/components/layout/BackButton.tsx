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
import { useRouter, usePathname } from "next/navigation";
import { AngleLeftIcon } from "@patternfly/react-icons";
import React from "react";

interface BackButtonProps {
  style?: React.CSSProperties;
}

const buttonStyle = {
  background: "none",
  border: "none",
  padding: "0",
  font: "inherit",
  cursor: "pointer",
  color: "black",
  fontWeight: "bold",
};

export default function BackButton({ style }: BackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        onClick={() => router.back()}
        style={{ ...buttonStyle, ...style }}
        hidden={pathname === "/"}
      >
        <AngleLeftIcon />
        Back
      </button>
    </>
  );
}
