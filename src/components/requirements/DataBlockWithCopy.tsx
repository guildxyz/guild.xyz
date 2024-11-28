"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { useClipboard } from "foxact/use-clipboard";
import { useDebouncedState } from "foxact/use-debounced-state";
import { type PropsWithChildren, useEffect } from "react";
import { DataBlock } from "./DataBlock";

type Props = {
  text: string;
};

export const DataBlockWithCopy = ({
  text,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { copied, copy } = useClipboard({
    timeout: 1500,
  });

  /**
   * Maintaining a debounced copied state too, so we can change the tooltip content only after the tooltip is actually invisible
   */

  const [debouncedCopied, debouncilySetState] = useDebouncedState(copied, 200);

  useEffect(() => {
    debouncilySetState(copied);
  }, [debouncilySetState, copied]);

  const tooltipInCopiedState = copied || debouncedCopied;

  return (
    <Tooltip open={copied || undefined}>
      <TooltipTrigger
        onClick={() => copy(text)}
        className="inline-flex rounded-md"
      >
        <DataBlock>
          <span>{children ?? text}</span>
        </DataBlock>
      </TooltipTrigger>

      <TooltipPortal>
        <TooltipContent side="top" className="flex items-center gap-1.5">
          {tooltipInCopiedState && (
            <Check weight="bold" className="text-icon-success" />
          )}
          <span>{tooltipInCopiedState ? "Copied" : "Click to copy"}</span>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};
