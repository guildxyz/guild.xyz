import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Collapse,
  Stack,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"

type ErrorState = {
  title: string
  description: string
}

type Props = {
  error: Error
  processError: (error: Error) => ErrorState
}

const Error = ({ error, processError }: Props): JSX.Element => {
  const [state, setState] = useState({ title: "", description: "" })

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
      <Alert status="error" mb="4">
        <AlertIcon />
        <Stack>
          <AlertTitle>{state.title}</AlertTitle>
          <AlertDescription>{state.description}</AlertDescription>
        </Stack>
      </Alert>
    </Collapse>
  )
}

export { Error }
export type { ErrorState }
