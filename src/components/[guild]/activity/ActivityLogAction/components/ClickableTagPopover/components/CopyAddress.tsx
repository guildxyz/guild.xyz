import { useClipboard } from "@chakra-ui/react"
import Button from "components/common/Button"
import { Check, Copy } from "phosphor-react"

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
