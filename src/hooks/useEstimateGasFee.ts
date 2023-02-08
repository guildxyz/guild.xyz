import { Contract } from "@ethersproject/contracts"
import { formatUnits } from "@ethersproject/units"
import { Chain, Chains, RPC } from "connectors"
import { fetchNativeCurrencyPriceInUSD } from "pages/api/fetchPrice"
import useSWRImmutable from "swr/immutable"

const useEstimateGasFee = (
  key: string,
  contract: Contract,
  methodName: string,
  params: any[]
) => {
  /**
   * Defining both estimateGasFee and convertGasFeeToUSD inside the hook, so we don't
   * need to pass the contract, methodName, and params parameters to these functions
   * inside useSWRImmutable
   */
  const estimateGasFee = async () => {
    const [gasPrice, gas] = await Promise.all([
      contract.provider.getGasPrice(),
      contract.estimateGas[methodName](...params),
    ])

    return gasPrice.mul(gas)
  }

  const shouldFetch = Boolean(contract && methodName && params?.length)

  const {
    data: estimatedGasFee,
    isValidating: isGasEstimationLoading,
    error: estimateGasError,
  } = useSWRImmutable(shouldFetch ? ["estimateGas", key] : null, estimateGasFee)

  const convertGasFeeToUSD = async () => {
    const { chainId } = await contract.provider.getNetwork()
    const nativeCurrencyPriceInUSD = await fetchNativeCurrencyPriceInUSD(
      Chains[chainId] as Chain
    )

    const estimatedGasFeeInFloat = parseFloat(
      formatUnits(estimatedGasFee, RPC[Chains[chainId]].nativeCurrency.decimals)
    )

    return estimatedGasFeeInFloat * nativeCurrencyPriceInUSD
  }

  const shouldConvert = !!contract && !!estimatedGasFee

  const {
    data: estimatedGasFeeInUSD,
    isValidating: isConvertLoading,
    error: covertError,
  } = useSWRImmutable(
    shouldConvert ? ["estimateGasUSD", contract, estimatedGasFee] : null,
    convertGasFeeToUSD
  )

  return {
    estimatedGasFee,
    estimatedGasFeeInUSD,
    isEstimateGasLoading: isGasEstimationLoading || isConvertLoading,
    estimateGasError: estimateGasError ?? covertError,
  }
}

export default useEstimateGasFee
