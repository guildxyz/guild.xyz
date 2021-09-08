import { Button } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { Rest } from "types"

const ModalButton = ({
  children,
  ...rest
}: PropsWithChildren<any> & Rest): JSX.Element => (
  <Button w="100%" colorScheme="primary" size="lg" {...rest}>
    {children}
  </Button>
)

export default ModalButton
