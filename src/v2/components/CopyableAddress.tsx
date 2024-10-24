import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"
import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, useRef } from "react"
import shortenHex from "utils/shortenHex"
import { Button } from "./ui/Button"
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from "./ui/Tooltip"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  address: string
  domain?: string
  decimals?: number
}

const CopyableAddress = ({
  address,
  domain,
  decimals = 3,
  className,
  ...props
}: Props): JSX.Element => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { hasCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <Tooltip defaultOpen={false} open={hasCopied || undefined}>
      <TooltipTrigger asChild>
        <Button
          ref={buttonRef}
          onClick={() => copyToClipboard(address)}
          variant="unstyled"
          className={cn("h-max p-0", className)}
          {...props}
        >
          {domain || shortenHex(address, decimals)}
        </Button>
      </TooltipTrigger>

      <TooltipPortal>
        <TooltipContent>
          <span>{hasCopied ? "Copied" : "Click to copy address"}</span>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}

export { CopyableAddress }
