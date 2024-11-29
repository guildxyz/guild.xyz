import { cn } from "@/lib/cssUtils";
import type { PropsWithChildren } from "react";

export const Requirement = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => (
  <div className={cn("flex w-full items-center gap-4 py-2", className)}>
    {children}
  </div>
);

export const RequirementImage = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => (
  <div
    className={cn(
      "flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blackAlpha dark:bg-blackAlpha-hard",
      className,
    )}
  >
    {children}
  </div>
);

export const RequirementContent = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => (
  <div className={cn("flex flex-grow flex-col items-start", className)}>
    {children}
  </div>
);

export const RequirementFooter = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => (
  <div
    className={cn(
      "flex flex-wrap items-center gap-1.5 has-[>*]:mt-1",
      className,
    )}
  >
    {children}
  </div>
);
