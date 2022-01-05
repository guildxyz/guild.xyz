import {
  Box,
  Collapse,
  FormErrorMessage as ChakraFormErrorMessage,
  useFormControlContext,
} from "@chakra-ui/react"
import { PropsWithChildren } from "react"

const FormErrorMessage = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  const field = useFormControlContext()

  return (
    <Collapse in={field?.isInvalid}>
      <Box minH="1em">
        <ChakraFormErrorMessage>{children}</ChakraFormErrorMessage>
      </Box>
    </Collapse>
  )
}

export default FormErrorMessage
