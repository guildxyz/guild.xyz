import { fetchNativeCurrencyPriceInUSD } from "pages/api/fetchPrice"
import useSWR from "swr"
import useSWRImmutable from "swr/immutable"
import { EstimateContractGasParameters, formatUnits } from "viem"
import { useChainId, useGasPrice, usePublicClient, useWalletClient } from "wagmi"
import { CHAIN_CONFIG, Chain, Chains } from "wagmiConfig/chains"

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

const useEstimateGas = (
  config: EstimateContractGasParameters & { shouldFetch?: boolean }
) => {
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const chainId = useChainId()

  const {
    data: gasPrice,
    isLoading: isGasPriceLoading,
    error: gasPriceError,
  } = useGasPrice()

  const estimateGas = () =>
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    publicClient.estimateContractGas({
      ...config,
      account: walletClient?.account,
    })

  const {
    data: estimatedGas,
    error: estimateGasError,
    isLoading: isEstimateGasLoading,
    mutate,
  } = useSWR(
    !!walletClient?.account && !!config?.shouldFetch
      ? [
          "estimateGas",
          config.address,
          config.functionName,
          config.args?.toString(),
          chainId,
        ]
      : null,
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
      typeof estimatedGas === "bigint" && typeof gasPrice === "bigint"
        ? estimatedGas * gasPrice
        : undefined,
    estimatedGasInUSD: estimatedGasInUSD,
    gasEstimationError: convertError ?? estimateGasError ?? gasPriceError,
    isLoading: isGasPriceLoading || isEstimateGasLoading || isConvertLoading,
    mutate,
  }
}

export default useEstimateGas
