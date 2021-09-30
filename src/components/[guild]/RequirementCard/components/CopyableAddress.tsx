import { Button, Tooltip, useClipboard } from "@chakra-ui/react"
import shortenHex from "utils/shortenHex"

type Props = {
  address: string
}

const CopyableAddress = ({ address }: Props): JSX.Element => {
  const { hasCopied, onCopy } = useClipboard(address)
  return (
    <Tooltip
      placement="top"
      label={hasCopied ? "Copied" : "Click to copy address"}
      closeOnClick={false}
      hasArrow
    >
      <Button
        onClick={onCopy}
        variant="unstyled"
        fontWeight="normal"
        fontSize="sm"
        height="auto"
      >
        {shortenHex(address, 3)}
      </Button>
    </Tooltip>
  )
}

export default CopyableAddress
