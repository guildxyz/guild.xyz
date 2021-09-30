import { Button, Text, Tooltip, useClipboard } from "@chakra-ui/react"
import { Rest } from "types"
import shortenHex from "utils/shortenHex"

type Props = {
  address: string
  decimals?: number
} & Rest

const CopyableAddress = ({ address, decimals = 3, ...rest }: Props): JSX.Element => {
  const { hasCopied, onCopy } = useClipboard(address)

  return (
    <Tooltip
      placement="top"
      label={hasCopied ? "Copied" : "Click to copy address"}
      closeOnClick={false}
      hasArrow
    >
      <Button onClick={onCopy} variant="unstyled" height="auto" {...rest}>
        <Text>{shortenHex(address, decimals)}</Text>
      </Button>
    </Tooltip>
  )
}

export default CopyableAddress
