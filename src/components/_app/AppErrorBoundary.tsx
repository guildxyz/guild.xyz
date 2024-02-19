import ErrorPage from "pages/_error"
import { PropsWithChildren } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { usePostHogContext } from "./PostHogProvider"

const AppErrorBoundary = ({ children }: PropsWithChildren<unknown>) => {
  const { captureEvent } = usePostHogContext()

  return (
    <ErrorBoundary
      onError={(error, info) => {
        console.error("the error is:", error)
        captureEvent("Top level ErrorBoundary catched error", {
          error,
          info,
        })
      }}
      fallback={<ErrorPage />}
    >
      {children}
    </ErrorBoundary>
  )
}
export default AppErrorBoundary
