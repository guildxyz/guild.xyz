import useSWR from "swr"
import { EstimateContractGasParameters } from "viem"
import { useChainId, useFeeData, usePublicClient, useWalletClient } from "wagmi"

const useEstimateGas = (config: EstimateContractGasParameters) => {
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const chainId = useChainId()

  const {
    data: feeData,
    isLoading: isFeeDataLoading,
    error: feeDataError,
  } = useFeeData()

  const estimateGas = () => {
    if (!walletClient?.account || (config.chainId && config.chainId !== chainId))
      return undefined

    return publicClient.estimateContractGas({
      ...config,
      account: walletClient?.account,
    })
  }

  const {
    data: estimatedGas,
    error: estimateGasError,
    isLoading: isEstimateGasLoading,
    mutate,
  } = useSWR(
    [
      "estimateGas",
      config.address,
      config.functionName,
      config.args?.toString(),
      chainId,
    ],
    estimateGas
  )

  return {
    estimatedGas:
      typeof estimatedGas === "bigint" && typeof feeData?.gasPrice === "bigint"
        ? estimatedGas * feeData?.gasPrice
        : undefined,
    gasEstimationError: estimateGasError ?? feeDataError,
    isLoading: isFeeDataLoading || isEstimateGasLoading,
    mutate,
  }
}

export default useEstimateGas
