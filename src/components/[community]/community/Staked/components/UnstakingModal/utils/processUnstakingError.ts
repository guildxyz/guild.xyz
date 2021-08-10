import { ErrorInfo } from "components/common/Error"
import type { MetaMaskError } from "utils/processMetaMaskError"
import { processMetaMaskError } from "utils/processMetaMaskError"

const processUnstakingError = (error: MetaMaskError): ErrorInfo => {
  switch (error.message) {
    case "execution reverted: Not enough unlocked tokens":
      return {
        title: "Not enough unlocked tokens",
        description:
          "If your timelock has just expired, you have to wait until the next block to be able unstake. Try again!",
      }
    default:
      return processMetaMaskError(error)
  }
}

export default processUnstakingError
