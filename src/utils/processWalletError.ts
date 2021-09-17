import { ErrorInfo } from "components/common/Error"
import type { WalletError } from "types"

const processWalletError = (error: WalletError): ErrorInfo => {
  switch (error.code) {
    case 4001:
      return {
        title: "Request rejected",
        description: "Please try again and confirm the request in your wallet",
      }
    case 4900:
      return {
        title: "Disconnected",
        description: "Your wallet is disconnected from all chains",
      }
    case 4901:
      return {
        title: "Chain disconnected",
        description: "Your wallet is not connected to the requested chain",
      }
    case 4100:
      return {
        title: "Unauthorized",
        description: "The requested method and/or account has not been authorized",
      }
    case 4200:
      return {
        title: "Unsupported method",
        description: "Your wallet does not support the requested method",
      }
    case -32003:
      return {
        title: "Transaction rejected",
        description: "Transaction creation failed. Please try again!",
      }
    case -32603:
      return {
        title: "Internal error",
        description: "If you've set a custom gas price, that may be wrong",
      }
    case -32001:
      return {
        title: "Resource not found",
        description: "Requested resource is not found",
      }
    case -32002:
      return {
        title: "Resource unavailable",
        description: "Requested resource is not available",
      }
    case -32005:
      return {
        title: "Limit exceeded",
        description: "Request exceeds defined limit",
      }
    default:
      console.error(error)
      return {
        title: "An unknown error occurred",
        description: "Check the console for more details",
      }
  }
}

export default processWalletError
export type { WalletError }
