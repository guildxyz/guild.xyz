import { useCallback } from "react"
import { useCopyToClipboard } from "usehooks-ts"
import { useToast } from "./useToast"

type ErrorWithCorrelationId = {
  error: string
  correlationId: string
}

const isErrorWithCorrelationId = (error: any): error is ErrorWithCorrelationId =>
  !!error?.correlationId

const useErrorToast = () => {
  const { toast } = useToast()
  const [, copyToClipboard] = useCopyToClipboard()

  const errorToast = useCallback(
    (message?: string, correlationId?: string) =>
      toast({
        variant: "error",
        title: "Error",
        description: correlationId ? (
          <div className="flex flex-col gap-2">
            {message && <p>{message}</p>}
            <pre
              className="cursor-pointer text-xs opacity-60"
              onClick={() => copyToClipboard(correlationId)}
            >{`ID: ${correlationId}`}</pre>
          </div>
        ) : (
          message
        ),
      }),
    [toast, copyToClipboard]
  )

  return useCallback(
    (error: string | ErrorWithCorrelationId | Error) => {
      if (!error) return errorToast()

      if (isErrorWithCorrelationId(error)) {
        return errorToast(error.error, error.correlationId)
      }

      if (typeof error === "string") return errorToast(error)

      if (error.message) return errorToast(error.message)
    },
    [errorToast]
  )
}

export { useErrorToast }
