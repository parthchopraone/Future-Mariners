"use client";

import Link, { LinkProps } from "next/link";
import { MouseEvent, ReactNode, useState } from "react";

type LoadingLinkProps = LinkProps & {
  children: ReactNode;
  loadingText?: ReactNode;
  className?: string;
};

const LoadingLink = ({
  children,
  loadingText = "Loading...",
  onClick,
  ...props
}: LoadingLinkProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      !event.defaultPrevented &&
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      setLoading(true);
    }
  };

  return (
    <Link
      {...props}
      onClick={handleClick}
      aria-busy={loading || undefined}
    >
      {loading ? loadingText : children}
    </Link>
  );
};

export default LoadingLink;
