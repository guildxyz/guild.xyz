import { WarningCircle } from "phosphor-react"
import { PropsWithChildren, useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "./ui/Alert"
import { Collapsible, CollapsibleContent } from "./ui/Collapsible"

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
}: PropsWithChildren<Props<ErrorType>>): JSX.Element => {
  const [state, setState] = useState<ErrorInfo>({ title: "", description: "" })

  useEffect(() => {
    if (!error) {
      setState({ title: "", description: "" })
      return
    }

    const newState = processError(error)
    setState(newState)
  }, [error, processError])

  return (
    <Collapsible open={!!state.title}>
      <CollapsibleContent>
        <Alert variant="error" className="mb-6">
          <WarningCircle weight="fill" className="size-6" />
          <AlertTitle>{state.title}</AlertTitle>
          <AlertDescription>{state.description}</AlertDescription>
        </Alert>
      </CollapsibleContent>
    </Collapsible>
  )
}

export { Error }
export type { ErrorInfo }
