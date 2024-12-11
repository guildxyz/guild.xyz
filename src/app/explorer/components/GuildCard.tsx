import { Badge } from "@/components/ui/Badge";
import { ScrollBar } from "@/components/ui/ScrollArea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { cn } from "@/lib/cssUtils";
import { SealCheck } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import type { PropsWithChildren } from "react";
import FadedScrollArea from "../FadedScrollArea";

export const GuildCard = ({
  className,
  ...props
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl bg-card-secondary p-4 transition-colors hover:cursor-pointer hover:bg-card",
        className,
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Image
          src="/images/banner-light.svg"
          alt="Banner"
          width={100}
          height={100}
          className="aspect-square h-10 w-10 rounded-full border-2 border-whiteAlpha-medium bg-blackAlpha-medium object-cover object-center"
        />
        <div className="flex flex-col overflow-hidden">
          <div className="-mb-1 flex items-center gap-1">
            <p className="truncate font-bold">Guild with a Long F'in Name</p>
            <SealCheck
              size={16}
              weight="fill"
              className="shrink-0 text-blue-400"
            />
          </div>
          <small className="font-bold opacity-50">22K</small>
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2">
        <FadedScrollArea className="w-full max-w-full">
          <div className="flex gap-2">
            <Badge className="rounded-full text-sm" size="lg">
              Testoasdadasdas
            </Badge>
            <Badge className="rounded-full text-sm" size="lg">
              Testoasdadasdas
            </Badge>
          </div>
          <ScrollBar orientation="horizontal" className="opacity-0" />
        </FadedScrollArea>
      </div>

      {/* Description */}
      <p
        className="my-2 opacity-50"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        Community management through role-based access control.
      </p>

      {/* Indicators */}
      <div className="mt-auto flex gap-1">
        <Tooltip>
          <TooltipTrigger>
            <Image
              src="/images/banner-light.svg"
              alt="Banner"
              width={100}
              height={100}
              className="aspect-square h-7 w-7 rounded-full bg-card object-cover object-center"
            />
          </TooltipTrigger>
          <TooltipContent side="right" variant="popover">
            <p>This is a tooltip!</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <Image
              src="/images/banner-light.svg"
              alt="Banner"
              width={100}
              height={100}
              className="aspect-square h-7 w-7 rounded-full bg-card object-cover object-center"
            />
          </TooltipTrigger>
          <TooltipContent side="right" variant="popover">
            <p>This is a tooltip!</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <Image
              src="/images/banner-light.svg"
              alt="Banner"
              width={100}
              height={100}
              className="aspect-square h-7 w-7 rounded-full bg-card object-cover object-center"
            />
          </TooltipTrigger>
          <TooltipContent side="right" variant="popover">
            <p>This is a tooltip!</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <Image
              src="/images/banner-light.svg"
              alt="Banner"
              width={100}
              height={100}
              className="aspect-square h-7 w-7 rounded-full bg-card object-cover object-center"
            />
          </TooltipTrigger>
          <TooltipContent side="right" variant="popover">
            <p>This is a tooltip!</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
