import Link from "next/link";
import type { ReactNode, MouseEvent } from "react";

interface NavigateWrapperProps {
  to: string;
  children: ReactNode;
  prefetch?: boolean;
  scroll?: boolean;
  stopPropagation?: boolean;
}

export default function NavigateWrapper({
  to,
  children,
  prefetch = true,
  scroll = true,
  stopPropagation = false,
}: NavigateWrapperProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (stopPropagation) e.stopPropagation();
  };

  return (
    <Link href={to} prefetch={prefetch} scroll={scroll} onClick={handleClick}>
      {children}
    </Link>
  );
}
