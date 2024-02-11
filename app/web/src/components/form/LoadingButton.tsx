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
    setPending(true);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button
      variant="primary"
      type="submit"
      isLoading={pending}
      disabled={pending}
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
