import { useClipboard } from "@chakra-ui/react"
import { Check } from "@phosphor-icons/react/Check"
import { Copy } from "@phosphor-icons/react/Copy"
import Button from "components/common/Button"

type Props = {
  address: string
}

const CopyAddress = ({ address }: Props): JSX.Element => {
  const { onCopy, hasCopied } = useClipboard(address ?? "")

  return (
    <Button
      variant="ghost"
      leftIcon={hasCopied ? <Check /> : <Copy />}
      size="sm"
      borderRadius={0}
      onClick={onCopy}
      justifyContent="start"
    >
      Copy address
    </Button>
  )
}
export default CopyAddress
