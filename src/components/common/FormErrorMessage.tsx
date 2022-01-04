import {
  Box,
  Collapse,
  FormErrorMessage as ChakraFormErrorMessage,
} from "@chakra-ui/react"
import { PropsWithChildren, useEffect, useState } from "react"

const FormErrorMessage = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  const [renderedChildren, setRenderedChildren] = useState(undefined)

  useEffect(() => {
    if (!!children) setRenderedChildren(children)
  }, [children])

  return (
    <Collapse in={!!children} animateOpacity>
      <Box h={5}>
        <ChakraFormErrorMessage>{renderedChildren}</ChakraFormErrorMessage>
      </Box>
    </Collapse>
  )
}

export default FormErrorMessage
