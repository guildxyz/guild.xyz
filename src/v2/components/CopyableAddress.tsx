import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes } from "react"
import { useCopyToClipboard } from "usehooks-ts"
import shortenHex from "utils/shortenHex"
import { Button } from "./ui/Button"

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
  const [copiedText, copyToClipboard] = useCopyToClipboard()

  return (
    // <Tooltip
    //   placement="top"
    //   label={!!copiedText ? "Copied" : "Click to copy address"}
    //   closeOnClick={false}
    //   hasArrow
    // >
    <Button
      onClick={() => copyToClipboard(address)}
      variant="unstyled"
      className={cn("h-max !px-0 !py-0", className)}
      {...props}
    >
      {domain || shortenHex(address, decimals)}
    </Button>
    // </Tooltip>
  )
}

export { CopyableAddress }
