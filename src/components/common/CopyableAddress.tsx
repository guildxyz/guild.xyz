import { Text, Tooltip, useClipboard } from "@chakra-ui/react"
import Button from "components/common/Button"
import { Rest } from "types"
import shortenHex from "utils/shortenHex"

type Props = {
  address: string
  domain?: string
  decimals?: number
} & Rest

const CopyableAddress = ({
  address,
  domain,
  decimals = 3,
  ...rest
}: Props): JSX.Element => {
  const { hasCopied, onCopy } = useClipboard(address)

  return (
    <Tooltip
      placement="top"
      label={hasCopied ? "Copied" : "Click to copy address"}
      closeOnClick={false}
      hasArrow
    >
      <Button onClick={onCopy} variant="unstyled" height="auto" {...rest}>
        <Text>{domain || shortenHex(address, decimals)}</Text>
      </Button>
    </Tooltip>
  )
}

export default CopyableAddress
