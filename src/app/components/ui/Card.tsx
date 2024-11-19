import { cn } from "lib/cssUtils";
import { type HTMLAttributes, forwardRef } from "react";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-2xl bg-card text-foreground shadow-md",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export { Card };
