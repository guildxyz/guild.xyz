import Bugsnag from "@bugsnag/js"
import ErrorPage from "pages/_error"
import { PropsWithChildren } from "react"
import { ErrorBoundary } from "react-error-boundary"

const AppErrorBoundary = ({ children }: PropsWithChildren<unknown>) => (
  <ErrorBoundary
    onError={(error, info) => {
      // Inpired by: https://github.com/bugsnag/bugsnag-js/blob/9fe0c2f4d248d3e513d20a010d28f2fd4a4f9f9e/packages/plugin-react/src/index.js#L67-L74
      Bugsnag.notify(error, (event) => {
        event.severity = "error"
        event.unhandled = true

        if (info?.componentStack) {
          event.addMetadata("react", {
            info: formatComponentStack(info.componentStack),
          })
        }
      })
    }}
    fallback={<ErrorPage />}
  >
    {children}
  </ErrorBoundary>
)

const formatComponentStack = (str: string) => {
  const lines = str.split(/\s*\n\s*/g)
  let ret = ""

  for (let line = 0, len = lines.length; line < len; line++) {
    if (lines[line].length) ret += `${ret.length ? "\n" : ""}${lines[line]}`
  }

  return ret
}

export default AppErrorBoundary
