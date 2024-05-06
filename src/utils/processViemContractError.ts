import {
  BaseError,
  ContractFunctionRevertedError,
  InsufficientFundsError,
} from "viem"

const processViemContractError = (
  error: Error,
  errorNameMapper?: (errorName: string) => string
): string | undefined => {
  if (!error) return undefined
  let mappedError: string

  if (error instanceof BaseError) {
    const revertError = error.walk(
      (err) => err instanceof ContractFunctionRevertedError
    )

    let prettyViemError
    if (revertError instanceof ContractFunctionRevertedError) {
      prettyViemError = getPrettyViemError(revertError.data?.errorName)
    }

    if (
      typeof errorNameMapper === "function" &&
      revertError instanceof ContractFunctionRevertedError
    ) {
      const errorName = revertError.data?.errorName ?? ""
      mappedError = errorNameMapper(errorName)
    }

    const insufficientFundsError = error.walk(
      (err) => err instanceof InsufficientFundsError
    )
    if (insufficientFundsError) {
      return "Your current balance is insufficient to cover the guild fee and the transaction gas costs"
    }

    return (
      prettyViemError ??
      mappedError ??
      error.shortMessage ??
      error.message ??
      "Contract error"
    )
  }

  return undefined
}

const getPrettyViemError = (errorName) => {
  switch (errorName) {
    case "IncorrectSignature":
    case "ECDSAInvalidSignature":
    case "ECDSAInvalidSignatureLength":
    case "ECDSAInvalidSignatureS":
      return "We couldn't verify your signature. Please try signing in again, and make sure you are using the correct credentials."
    case "ERC1967InvalidImplementation":
      return "There seems to be an error with the smart contract executing this action. Please contact our support team for further assistance."
    case "ERC1967NonPayable":
      return "This transaction cannot accept Ether. Please check that you are sending funds from the correct token type."
    case "ExpiredSignature":
      return "Your signature has expired. Please try signing in again!"
    case "FailedInnerCall":
      return "Something went wrong with the processing of your request. Please try again later. If the problem persists, contact our support team for help."
    case "FailedToSendEther":
      return "We were unable to complete your Ether transaction. Please check your balance and network settings, and try again."
    case "IncorrectFee":
      return "The fee for this transaction is incorrect. Please try again after refreshing the page, or contact our support team for help."
    case "InvalidInitialization":
      return "An error happened whilst setting up your transaction. If the issue persists, please reach out to our support team for help."
    case "NotInitializing":
      return "It looks like something isn't set up yet. Please make sure all necessary initial setup steps have been completed before proceeding."
    case "OwnableInvalidOwner":
    case "OwnableUnauthorizedAccount":
      return "It looks like you are not the owner of the resource that you are trying to access. Please try signing in again!"
    case "PoolDoesNotExist":
      return "The reward pool that your action tried to use does not exist."
    case "TransferFailed":
      return "We couldn’t complete your transfer. Please check your connection and ensure all details are correct, and try again."
    case "UUPSUnauthorizedCallContext":
      return "Your request cannot be processed because it was made in an unauthorized context. Please contact our support team for further assistance."
    case "UUPSUnsupportedProxiableUUID":
      return "We encountered an issue with the upgrade identifier. Please contact our support team for further assistance."
  }
}

export default processViemContractError
