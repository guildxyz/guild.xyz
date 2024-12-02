import { cn } from "@/lib/cssUtils";
import { QuestionMark } from "@phosphor-icons/react/dist/ssr";
import type { PropsWithChildren, ReactNode } from "react";
import { Button, type ButtonProps } from "../ui/Button";
import { Card } from "../ui/Card";

export const RewardCard = ({
  image,
  title,
  description,
  className,
  children,
}: PropsWithChildren<{
  image?: ReactNode | string;
  title: string;
  description?: string;
  className?: string;
}>) => (
  <Card
    className={cn("flex flex-col gap-4 border-2 p-4 shadow-none", className)}
  >
    <div className="grid grid-cols-[theme(space.9)_1fr] items-center gap-x-2 gap-y-0">
      <div className="row-span-2 flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blackAlpha dark:bg-blackAlpha-hard">
        {!image ? (
          <QuestionMark weight="bold" className="size-4" />
        ) : typeof image === "string" ? (
          <img src={image} alt="Reward icon" />
        ) : (
          image
        )}
      </div>

      <span
        className={cn("font-bold text-sm", {
          "row-span-2": !description,
        })}
      >
        {title}
      </span>

      {description && (
        <span className="text-foreground-secondary text-xs">{description}</span>
      )}
    </div>
    {children}
  </Card>
);

export const RewardCardButton = ({
  className,
  ...props
}: Omit<ButtonProps, "size">) => (
  <Button className={cn("mt-auto", className)} size="sm" {...props} />
);
