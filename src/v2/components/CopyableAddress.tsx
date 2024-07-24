import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, useRef, useState } from "react"
import { useCopyToClipboard } from "usehooks-ts"
import shortenHex from "utils/shortenHex"
import { Button } from "./ui/Button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip"

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
  const [, copyToClipboard] = useCopyToClipboard()
  const [forceOpenTooltip, setForceOpenTooltip] = useState(false)

  return (
    <Tooltip defaultOpen={false} open={forceOpenTooltip || undefined}>
      <TooltipTrigger asChild>
        <Button
          ref={buttonRef}
          onClick={() =>
            copyToClipboard(address).then(() => {
              setForceOpenTooltip(true)
              setTimeout(() => setForceOpenTooltip(false), 3000)
            })
          }
          variant="unstyled"
          className={cn("h-max p-0", className)}
          {...props}
        >
          {domain || shortenHex(address, decimals)}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>{forceOpenTooltip ? "Copied" : "Click to copy address"}</span>
      </TooltipContent>
    </Tooltip>
  )
}

export { CopyableAddress }
