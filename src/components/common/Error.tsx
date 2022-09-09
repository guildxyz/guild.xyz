import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Collapse,
  Stack,
} from "@chakra-ui/react"
import { PropsWithChildren, useEffect, useState } from "react"

type ErrorInfo = {
  title: string
  description: string
}

type Props<ErrorType> = {
  error: ErrorType
  processError: (error: ErrorType) => ErrorInfo
}

// tailing comma for generics to sidestep the JSX ambiguity
const Error = <ErrorType,>({
  error,
  processError,
  children,
}: PropsWithChildren<Props<ErrorType>>): JSX.Element => {
  const [state, setState] = useState<ErrorInfo>({ title: "", description: "" })

  // delay the open of the Collapse from when the error has changed,
  // so it fetches the content height correctly
  const [delayedShow, setDelayedShow] = useState(!!error)

  useEffect(() => {
    if (!error) {
      setDelayedShow(false)
      return
    }

    setTimeout(() => setDelayedShow(true), 100)

    const newState = processError(error)
    setState(newState)
  }, [error, processError])

  return (
    <Collapse in={delayedShow}>
      <Alert status="error" mb="6">
        <AlertIcon />
        <Stack>
          <AlertTitle>{state.title}</AlertTitle>
          <AlertDescription>{state.description}</AlertDescription>
          {children && <Box pt="1">{children}</Box>}
        </Stack>
      </Alert>
    </Collapse>
  )
}

export { Error }
export type { ErrorInfo }
