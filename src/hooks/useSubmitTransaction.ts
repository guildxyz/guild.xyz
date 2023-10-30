import { useTransactionStatusContext } from "components/[guild]/Requirements/components/GuildCheckout/components/TransactionStatusContext"
import { useEffect } from "react"
import processViemContractError from "utils/processViemContractError"
import { Abi, TransactionReceipt, decodeEventLog } from "viem"
import {
  UsePrepareContractWriteConfig,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"
import useEstimateGas from "./useEstimateGas"

const useSubmitTransaction = <
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TChainId extends number
>(
  contractCallConfig: UsePrepareContractWriteConfig<TAbi, TFunctionName, TChainId>,
  options?: {
    setContext?: boolean
    customErrorsMap?: Record<string, string> // TODO: maybe we can infer custom error names from the ABI too? We could experiment with it later.
    onSuccess?: (
      transactionReceipt: TransactionReceipt,
      events: any[] // TODO for later: we could properly type this & infer event names/arg types in the future
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
    config,
    error: prepareError,
    isLoading: isPrepareLoading,
  } = usePrepareContractWrite<TAbi, TFunctionName, TChainId>({
    enabled: contractCallConfig.enabled ?? true,
    ...contractCallConfig,
  })

  const {
    estimatedGas,
    estimatedGasInUSD,
    gasEstimationError,
    isLoading: isGasEstimationLoading,
  } = useEstimateGas({
    abi: contractCallConfig.abi,
    address: contractCallConfig.address,
    functionName: contractCallConfig.functionName,
    args: contractCallConfig.args as readonly unknown[],
    value: contractCallConfig.value,
  })

  const {
    write,
    data,
    error: contractWriteError,
    isError: isContractWriteError,
    isLoading: isContractWriteLoading,
    reset,
  } = useContractWrite<TAbi, TFunctionName, "prepared">(config)

  useEffect(() => {
    if (!txHash && data?.hash) {
      setTxHash(data.hash)
    }
  }, [data])

  const {
    data: transactionReceipt,
    error: waitForTransactionError,
    isSuccess,
    isError: isWaitForTransactionError,
    isLoading: isWaitForTransactionLoading,
  } = useWaitForTransaction({ hash: data?.hash })

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
                abi: contractCallConfig.abi as TAbi,
                data: log.data,
                topics: (log as any).topics,
              })
            } catch {
              return null
            }
          })
          .filter(Boolean)

        onSuccess(transactionReceipt, events)
      }
    } else {
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
      write?.()
    },
    isPreparing: isPrepareLoading || isGasEstimationLoading,
    isLoading: isWaitForTransactionLoading || isContractWriteLoading,
    estimatedGas,
    estimatedGasInUSD,
    error,
  }
}

export default useSubmitTransaction
