import { ErrorInfo } from "components/common/Error"
import { WalletError } from "types"

const processConnectionError = (error: WalletError & Error): ErrorInfo => {
  // Returning a simpler error message in this case
  if (error.code === -32002)
    return {
      title: "Connection already in progress",
      description: "Please check your wallet.",
    }

  return {
    title: "Error",
    description: (error.cause as Error)?.message ?? "Unknown error",
  }
}

export default processConnectionError
