import { useClipboard } from "@chakra-ui/react"
import Button from "components/common/Button"
import { PiCheck } from "react-icons/pi"
import { PiCopy } from "react-icons/pi"

type Props = {
  address: string
}

const CopyAddress = ({ address }: Props): JSX.Element => {
  const { onCopy, hasCopied } = useClipboard(address ?? "")

  return (
    <Button
      variant="ghost"
      leftIcon={hasCopied ? <PiCheck /> : <PiCopy />}
      size="sm"
      borderRadius={0}
      onClick={onCopy}
      justifyContent="start"
    >
      PiCopy address
    </Button>
  )
}
export default CopyAddress
