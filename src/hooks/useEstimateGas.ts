import { CHAIN_CONFIG, Chain, Chains } from "chains"
import { fetchNativeCurrencyPriceInUSD } from "pages/api/fetchPrice"
import useSWR from "swr"
import useSWRImmutable from "swr/immutable"
import { EstimateContractGasParameters, formatUnits } from "viem"
import { useChainId, useFeeData, usePublicClient, useWalletClient } from "wagmi"

const convertGasFeeToUSD = async ([_, chainId, estimatedGas]: [
  string,
  number,
  bigint
]) => {
  const nativeCurrencyPriceInUSD = await fetchNativeCurrencyPriceInUSD(
    Chains[chainId] as Chain
  )

  const estimatedGasFeeInFloat = parseFloat(
    formatUnits(estimatedGas, CHAIN_CONFIG[Chains[chainId]].nativeCurrency.decimals)
  )

  return estimatedGasFeeInFloat * nativeCurrencyPriceInUSD
}

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

  const {
    data: estimatedGasInUSD,
    isValidating: isConvertLoading,
    error: convertError,
  } = useSWRImmutable(
    !!estimatedGas ? ["estimateGasUSD", chainId, estimatedGas] : null,
    convertGasFeeToUSD
  )

  return {
    estimatedGas:
      typeof estimatedGas === "bigint" && typeof feeData?.gasPrice === "bigint"
        ? estimatedGas * feeData?.gasPrice
        : undefined,
    estimatedGasInUSD: estimatedGasInUSD,
    gasEstimationError: convertError ?? estimateGasError ?? feeDataError,
    isLoading: isFeeDataLoading || isEstimateGasLoading || isConvertLoading,
    mutate,
  }
}

export default useEstimateGas
