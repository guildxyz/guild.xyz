import { Button } from "@chakra-ui/react"
import { Rest } from "temporaryData/types"

type Props = {
  children?: string | JSX.Element | JSX.Element[]
} & Rest

const ModalButton = ({ children, ...rest }: Props): JSX.Element => (
  <Button w="100%" colorScheme="primary" size="lg" {...rest}>
    {children}
  </Button>
)

export default ModalButton
