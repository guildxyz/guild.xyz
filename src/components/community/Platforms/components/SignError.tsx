import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Collapse,
  Stack,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import type { SignErrorType } from "../hooks/usePersonalSign"

type Props = { error: SignErrorType | null }

const SignError = ({ error }: Props): JSX.Element => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  // delay the open of the Collapse from when the error has changed,
  // so it fetches the content height correctly
  const [delayedShow, setDelayedShow] = useState(!!error)

  useEffect(() => {
    if (!error) {
      setDelayedShow(false)
      return
    }

    const { code, message } = error

    switch (code) {
      case 4001:
        setTitle("Cancelled")
        setDescription("The signature process got cancelled.")
        break
      default:
        console.error(message)
        setTitle("An unknown error occurred")
        setDescription("Check the console for more details.")
        break
    }
    setTimeout(() => setDelayedShow(true), 100)
  }, [error])

  return (
    <Collapse in={delayedShow}>
      <Alert status="error" mb="4">
        <AlertIcon />
        <Stack>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </Stack>
      </Alert>
    </Collapse>
  )
}

export default SignError
