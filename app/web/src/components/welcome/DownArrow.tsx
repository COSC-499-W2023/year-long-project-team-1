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

import { CSS } from "@lib/utils";
import { Tooltip, Icon } from "@patternfly/react-core";
import { useEffect, useState } from "react";
import { CgArrowDownO } from "react-icons/cg";

const downArrowStyle: CSS = {
  position: "absolute",
  bottom: "5vh",
  color: "var(--pf-v5-global--primary-color--500)",
  animation: "hover 1s infinite ease-in-out",
  transition: "opacity 300ms",
};

interface DownArrowProps {
  text?: string;
  style?: CSS;
  scrollThreshold?: number;
  containerRef?: React.RefObject<HTMLDivElement>;
  onScroll?: (scrolled: boolean) => void;
}

export const DownArrow = ({
  text,
  style,
  scrollThreshold = 0,
  containerRef,
  onScroll,
}: DownArrowProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef || !containerRef.current) return;
      const isScrolled = containerRef.current.scrollTop > scrollThreshold;

      setIsVisible(!isScrolled);

      if (onScroll) {
        onScroll(!isScrolled);
      }
    };

    const currentRef = containerRef?.current ?? undefined;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount
  return (
    <Tooltip
      content={text ?? "Scroll down for more information"}
      className="down-arrow-tooltip"
    >
      <div
        style={{ ...style, ...downArrowStyle, opacity: isVisible ? "1" : "0" }}
      >
        <Icon size="xl">
          <CgArrowDownO style={{ filter: "drop-shadow(0 0 0.5rem #aaaaaa)" }} />
        </Icon>
      </div>
    </Tooltip>
  );
};
