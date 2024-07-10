import { WarningCircle } from "@phosphor-icons/react/dist/ssr"
import { PropsWithChildren, useEffect, useState } from "react"
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
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-toast-error p-4">
          <WarningCircle
            weight="fill"
            className="size-6 text-destructive-ghost-foreground"
          />

          <div className="flex flex-col gap-1">
            <p className="font-bold">{state.title}</p>
            <p>{state.description}</p>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export { Error }
export type { ErrorInfo }
