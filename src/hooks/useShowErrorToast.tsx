import { Text } from "@chakra-ui/react"
import useToast from "hooks/useToast"

type ErrorWithCorrelationId = {
  error: string
  correlationId: string
}

const copyToClipboard = (str: string) => navigator?.clipboard?.writeText(str)

const useShowErrorToast = () => {
  const toast = useToast()

  const errorToast = (message?: string, correlationId?: string) => {
    toast({
      title: "Error",
      description: correlationId ? (
        <>
          {message && <Text>{message}</Text>}

          <Text
            as="pre"
            mt={2}
            fontSize="x-small"
            cursor="pointer"
            onClick={() => copyToClipboard(correlationId)}
            opacity="0.6"
          >
            {`ID: ${correlationId}`}
          </Text>
        </>
      ) : (
        message
      ),
      status: "error",
    })
  }

  const isErrorWithCorrelationId = (error: any): error is ErrorWithCorrelationId =>
    !!error?.correlationId

  const showErrorToast = (error: string | ErrorWithCorrelationId | Error) => {
    if (!error) return errorToast()

    if (isErrorWithCorrelationId(error)) {
      return errorToast(error.error, error.correlationId)
    }

    if (typeof error === "string") return errorToast(error)

    if (error.message) return errorToast(error.message)
  }

  return showErrorToast
}

export default useShowErrorToast
