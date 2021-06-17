/* eslint-disable react/jsx-props-no-spreading */
import { Button } from "@chakra-ui/react"

type Props = {
  children?: string | JSX.Element
  // for rest props
  [x: string]: any
}

const ModalButton = ({ children, ...rest }: Props): JSX.Element => (
  <Button w="100%" colorScheme="primary" size="lg" {...rest}>
    {children}
  </Button>
)

export default ModalButton
