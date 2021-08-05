import { ErrorInfo } from "components/common/Error"
import { processMetaMaskError } from "utils/processMetaMaskError"
import type { JoinError } from "../hooks/useJoinModalMachine"

const processJoinPlatformError = (error: JoinError): ErrorInfo => {
  // if it's a network error from fetching
  if (error instanceof Error) {
    return {
      title: "Network error",
      description: "Unable to connect to server",
    }
  }
  // if it's a HTTP error from fetching
  if (error instanceof Response) {
    return {
      title: "Backend error",
      description: "The backend couldn't handle the request",
    }
  }
  // if it's an error from signing
  return processMetaMaskError(error)
}

export default processJoinPlatformError
