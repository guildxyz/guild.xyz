import { useTransactionStatusContext } from "components/[guild]/Requirements/components/GuildCheckout/components/TransactionStatusContext"
import { useEffect } from "react"
import processViemContractError from "utils/processViemContractError"
import {
  Abi,
  ContractFunctionArgs,
  ContractFunctionName,
  DecodeEventLogReturnType,
  TransactionReceipt,
  decodeEventLog,
} from "viem"
import {
  UseSimulateContractParameters,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"
import useEstimateGas from "./useEstimateGas"

const useSubmitTransaction = (
  contractCallConfig: UseSimulateContractParameters,
  options?: {
    setContext?: boolean
    customErrorsMap?: Record<string, string>
    onSuccess?: (
      transactionReceipt: TransactionReceipt,
      events: DecodeEventLogReturnType[]
    ) => void
    onError?: (errorMessage: string, rawError: any) => void
  }
) => {
  const {
    txHash,
    setTxHash: setTxHashInContext,
    setTxError: setTxErrorInContext,
    setTxSuccess: setTxSuccessInContext,
  } = useTransactionStatusContext() ?? {}

  const setTxHash = (newHash: string) => {
    if (options?.setContext === false || typeof setTxHashInContext !== "function")
      return
    setTxHashInContext(newHash)
  }

  const setTxError = (newState: boolean) => {
    if (options?.setContext === false || typeof setTxErrorInContext !== "function")
      return
    setTxErrorInContext(newState)
  }

  const setTxSuccess = (newState: boolean) => {
    if (options?.setContext === false || typeof setTxSuccessInContext !== "function")
      return
    setTxSuccessInContext(newState)
  }

  const {
    data: config,
    error: prepareError,
    isLoading: isPrepareLoading,
  } = useSimulateContract({
    ...contractCallConfig,
    query: { enabled: contractCallConfig.query?.enabled ?? true },
  })

  const {
    estimatedGas,
    estimatedGasInUSD,
    gasEstimationError,
    isLoading: isGasEstimationLoading,
  } = useEstimateGas({
    abi: contractCallConfig.abi as Abi,
    address: contractCallConfig.address as `0x${string}`,
    functionName: contractCallConfig.functionName as ContractFunctionName,
    args: contractCallConfig.args as ContractFunctionArgs,
    value: contractCallConfig.value as bigint,
    shouldFetch: contractCallConfig.query?.enabled ?? true,
  })

  const {
    writeContract,
    data: hash,
    error: contractWriteError,
    isError: isContractWriteError,
    isPending: isContractWriteLoading,
    reset,
  } = useWriteContract()

  useEffect(() => {
    if (!txHash && hash) {
      setTxHash(hash)
    }
  }, [hash])

  const {
    data: transactionReceipt,
    error: waitForTransactionError,
    isSuccess,
    isError: isWaitForTransactionError,
    isLoading: isWaitForTransactionLoading,
  } = useWaitForTransactionReceipt({ hash })

  const rawError =
    waitForTransactionError ||
    contractWriteError ||
    prepareError ||
    gasEstimationError
  const error = processViemContractError(rawError, (errorName) => {
    if (!options?.customErrorsMap || !(errorName in options.customErrorsMap))
      return `Contract error: ${errorName}`
    return options.customErrorsMap[errorName]
  })

  const isError = isContractWriteError || isWaitForTransactionError
  const { onSuccess, onError } = options ?? {}
  useEffect(() => {
    if (!transactionReceipt && !isSuccess && !isError) return

    if (transactionReceipt && isSuccess) {
      setTxSuccess(true)

      if (typeof onSuccess === "function") {
        const events = transactionReceipt.logs
          .map((log) => {
            try {
              return decodeEventLog({
                abi: contractCallConfig.abi as Abi,
                data: log.data,
                topics: log.topics,
              })
            } catch {
              return null
            }
          })
          .filter(Boolean)

        onSuccess(
          transactionReceipt as TransactionReceipt,
          events as unknown as DecodeEventLogReturnType[]
        )
      }
    }

    if (error) {
      setTxError(true)

      onError?.(error, rawError)
      reset()
    }
  }, [transactionReceipt, isSuccess, isError])

  return {
    onSubmitTransaction: () => {
      setTxHash("")
      setTxError(false)
      setTxSuccess(false)

      if (!writeContract && error) {
        onError?.(error, rawError)
        return
      }

      if (process.env.NEXT_PUBLIC_MOCK_CONNECTOR) {
        setTxHash(
          "0x0000000000000000000000000000000000000000000000000000000000000000"
        )
        setTxSuccess(true)
        onSuccess({} as TransactionReceipt, [])
        return
      }

      writeContract?.(config)
    },
    isPreparing: isPrepareLoading || isGasEstimationLoading,
    isLoading: isWaitForTransactionLoading || isContractWriteLoading,
    estimatedGas,
    estimatedGasInUSD,
    error,
  }
}

export default useSubmitTransaction
