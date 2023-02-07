import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { formatUnits } from "@ethersproject/units"
import { Chain, Chains, RPC } from "connectors"
import { fetchNativeCurrencyPriceInUSD } from "pages/api/fetchPrice"
import useSWRImmutable from "swr/immutable"

const estimateGasFee = async (
  _: string,
  contract: Contract,
  methodName: string,
  ...params: any
) => {
  const [gasPrice, gas] = await Promise.all([
    contract.provider.getGasPrice(),
    contract.estimateGas[methodName](...params),
  ])

  return gasPrice.mul(gas)
}

const convertGasFeeToUSD = async (
  _: string,
  contract: Contract,
  estimatedGasFee: BigNumber
) => {
  const { chainId } = await contract.provider.getNetwork()
  const nativeCurrencyPriceInUSD = await fetchNativeCurrencyPriceInUSD(
    Chains[chainId] as Chain
  )

  const estimatedGasFeeInFloat = parseFloat(
    formatUnits(estimatedGasFee, RPC[Chains[chainId]].nativeCurrency.decimals)
  )

  return estimatedGasFeeInFloat * nativeCurrencyPriceInUSD
}

const useEstimateGasFee = (
  contract: Contract,
  methodName: string,
  params: any[]
) => {
  const shouldFetch = !!contract && !!methodName && !!params?.length

  const {
    data: estimatedGasFee,
    isValidating: isGasEstimationLoading,
    error: estimateGasError,
  } = useSWRImmutable(
    shouldFetch ? ["estimateGas", contract, methodName, ...params] : null,
    estimateGasFee
  )

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
