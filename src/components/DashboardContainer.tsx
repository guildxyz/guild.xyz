import { cn } from "@/lib/cssUtils";
import { Slot } from "@radix-ui/react-slot";
import type { HTMLAttributes } from "react";

interface DashboardContainerProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const DashboardContainer = ({
  children,
  className,
  asChild = false,
  ...props
}: DashboardContainerProps) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn(
        "mx-auto w-full max-w-screen-lg px-4 sm:px-8 md:px-10",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};
