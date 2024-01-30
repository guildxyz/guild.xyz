import { Input } from "@chakra-ui/react"

type Props = {
  isDisabled?: boolean
}

const ShortText = ({ isDisabled }: Props) => (
  <Input isDisabled={isDisabled} placeholder="Short text" />
)

export default ShortText
