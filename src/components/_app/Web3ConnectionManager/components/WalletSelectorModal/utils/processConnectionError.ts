import { UnsupportedChainIdError } from "@web3-react/core"
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector"
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector"
import { ErrorInfo } from "components/common/Error"
import { WalletError } from "types"

const processConnectionError = (error: WalletError & Error): ErrorInfo => {
  switch (error.constructor) {
    case NoEthereumProviderError:
      return {
        title: "Wallet not found",
        description:
          "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.",
      }
    case UnsupportedChainIdError:
      return {
        title: "Wrong network",
        description:
          "Please switch to a supported network, or connect to another wallet.",
      }
    case UserRejectedRequestErrorInjected:
    case UserRejectedRequestErrorWalletConnect:
      return {
        title: "Error connecting. Try again!",
        description:
          "Please authorize this website to access your Ethereum account.",
      }
    case Error:
      return {
        title: error.name,
        description: error.message,
      }
    default:
      console.error(error)
      return {
        title:
          error.code === -32002
            ? "Connection already in progress"
            : "An unknown error occurred",
        description:
          error.code === -32002
            ? "Check your wallet for more details."
            : "Check the console for more details.",
      }
  }
}

export default processConnectionError
