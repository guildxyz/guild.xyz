import { ErrorInfo } from "components/common/Error"
import type { SignErrorType } from "../hooks/usePersonalSign"

const processConnectionError = (error: SignErrorType): ErrorInfo => {
  const { code, message } = error

  switch (code) {
    case 4001:
      return {
        title: "Cancelled",
        description: "The signature process got cancelled.",
      }
    default:
      console.error(message)
      return {
        title: "An unknown error occurred",
        description: "Check the console for more details.",
      }
  }
}

export default processConnectionError
