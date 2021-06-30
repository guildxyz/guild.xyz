import { ErrorInfo } from "components/common/Error"
import { SignErrorType } from "../hooks/usePersonalSign"

const processJoinPlatformError = (
  error: Error | Response | SignErrorType
): ErrorInfo => {
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
  switch (error.code) {
    case 4001:
      return {
        title: "Cancelled",
        description: "The signature process got cancelled",
      }
    default:
      break
  }

  console.error(error)
  return {
    title: "An unknown error occurred",
    description: "Check the console for more details",
  }
}

export default processJoinPlatformError
