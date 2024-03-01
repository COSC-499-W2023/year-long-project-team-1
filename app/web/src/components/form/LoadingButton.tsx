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

import { Button } from "@patternfly/react-core";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LoadingButtonProps {
  href?: string;
  target?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  onClick?: React.MouseEventHandler;
  className?: string;
  style?: React.CSSProperties;
}

export default function LoadingButton({
  href,
  target,
  children,
  isLoading,
  onClick,
  className,
  style,
}: LoadingButtonProps) {
  const [pending, setPending] = useState(isLoading ?? false);

  useEffect(() => {
    setPending(isLoading ?? false);
  }, [isLoading]);

  useEffect(() => {
    let timeoutId: number;

    if (pending) {
      timeoutId = window.setTimeout(() => {
        setPending(false);
      }, 10000); // 10 seconds
    }

    return () => clearTimeout(timeoutId);
  }, [pending]);

  const handleClick = (e: React.MouseEvent) => {
    if (pending) return e.preventDefault();

    setPending(true);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button
      variant="primary"
      type="submit"
      isLoading={isLoading ?? pending}
      onClick={handleClick}
      className={className}
      style={style}
      component={href ? Link : "button"}
      href={href}
      target={target}
    >
      {children ?? "Submit"}
    </Button>
  );
}
