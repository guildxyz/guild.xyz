import { ErrorInfo } from "@/components/Error"
import type { WalletError } from "types"

/**
 * Maps EIP-1193 and JSON-RPC wallet error codes to user-friendly
 * error messages. Covers standard provider errors (4xxx) and
 * JSON-RPC errors (-32xxx) as defined in the Ethereum provider
 * specification.
 *
 * @see https://eips.ethereum.org/EIPS/eip-1193
 * @see https://www.jsonrpc.org/specification#error_object
 */
const processWalletError = (error: WalletError): ErrorInfo => {
  switch (error.code) {
    case 4001:
      return {
        title: "Request rejected",
        description:
          "Please try again and confirm the request in your wallet",
      }
    case 4900:
      return {
        title: "Disconnected",
        description:
          "Your wallet is disconnected from all chains",
      }
    case 4901:
      return {
        title: "Chain disconnected",
        description:
          "Your wallet is not connected to the requested chain",
      }
    case 4100:
      return {
        title: "Unauthorized",
        description:
          "The requested method and/or account has not been authorized",
      }
    case 4200:
      return {
        title: "Unsupported method",
        description:
          "Your wallet does not support the requested method",
      }
    case -32003:
      return {
        title: "Transaction rejected",
        description:
          "Transaction creation failed. Please try again!",
      }
    case -32004:
      return {
        title: "Method not supported",
        description:
          "The requested method is not supported by this provider",
      }
    case -32602:
      return {
        title: "Invalid parameters",
        description:
          "The request contains invalid parameters. Please check your input and try again",
      }
    case -32603:
      return {
        title: "Internal error",
        description:
          "If you've set a custom gas price, that may be wrong",
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
    case -32000:
      return {
        title: "Insufficient funds",
        description:
          "Insufficient funds for gas * price + value",
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
