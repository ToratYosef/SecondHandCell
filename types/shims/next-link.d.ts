import type { FC, ReactNode } from "react";

export interface LinkProps {
  href: string;
  children?: ReactNode;
  className?: string;
  style?: Record<string, unknown>;
}

declare const Link: FC<LinkProps>;
export default Link;
