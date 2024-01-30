import { Textarea } from "@chakra-ui/react"

type Props = {
  isDisabled?: boolean
}

const LongText = ({ isDisabled }: Props) => (
  <Textarea isDisabled={isDisabled} placeholder="Long text" resize="none" />
)

export default LongText
