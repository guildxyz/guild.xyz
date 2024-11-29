import type { PropsWithChildren } from "react";
import { Anchor } from "../ui/Anchor";

export const RequirementLink = ({
  href,
  children,
}: PropsWithChildren<{ href: string }>) => (
  <Anchor
    href={href}
    target="_blank"
    rel="noopener"
    variant="secondary"
    showExternal
    className="font-medium text-xs"
  >
    {children}
  </Anchor>
);
