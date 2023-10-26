import { BaseError, ContractFunctionRevertedError } from "viem"

const processViemContractError = (
  error: Error,
  errorNameMapper: (errorName: string) => string
): string | undefined => {
  if (!error) return undefined
  let mappedError: string

  if (error instanceof BaseError) {
    const revertError = error.walk(
      (err) => err instanceof ContractFunctionRevertedError
    )

    if (revertError instanceof ContractFunctionRevertedError) {
      const errorName = revertError.data?.errorName ?? ""

      mappedError = errorNameMapper(errorName)
    }

    return mappedError ?? error.message ?? "Contract error"
  }

  return undefined
}

export default processViemContractError
