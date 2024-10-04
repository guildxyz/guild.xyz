import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"
import { Check } from "@phosphor-icons/react/dist/ssr"
import { PropsWithChildren } from "react"
import { DataBlock } from "./DataBlock"

type Props = {
  text: string
}

const DataBlockWithCopy = ({
  text,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { copyToClipboard, hasCopied } = useCopyToClipboard()

  return (
    <Tooltip open={hasCopied || undefined}>
      <TooltipTrigger onClick={() => copyToClipboard(text)} className="rounded-md">
        <DataBlock>
          <span>{children ?? text}</span>
        </DataBlock>
      </TooltipTrigger>
      <TooltipContent side="top" className="flex items-center gap-1.5">
        {hasCopied && <Check weight="bold" className="text-success" />}
        <span>{hasCopied ? "Copied" : "Click to copy"}</span>
      </TooltipContent>
    </Tooltip>
  )
}

export { DataBlockWithCopy }
