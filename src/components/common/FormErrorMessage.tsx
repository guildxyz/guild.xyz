import {
  Box,
  Collapse,
  FormErrorMessage as ChakraFormErrorMessage,
} from "@chakra-ui/react"
import { PropsWithChildren } from "react"

const FormErrorMessage = ({ children }: PropsWithChildren<unknown>): JSX.Element => (
  <Collapse in={!!children}>
    <Box minH="1em">
      <ChakraFormErrorMessage>{children}</ChakraFormErrorMessage>
    </Box>
  </Collapse>
)

export default FormErrorMessage
