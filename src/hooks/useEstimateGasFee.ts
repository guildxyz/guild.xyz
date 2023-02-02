import { Contract } from "@ethersproject/contracts"
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

const useEstimateGasFee = (
  contract: Contract,
  methodName: string,
  params: any[]
) => {
  const shouldFetch = !!contract && !!methodName && !!params?.length

  return useSWRImmutable(
    shouldFetch ? ["estimateGas", contract, methodName, ...params] : null,
    estimateGasFee
  )
}

export default useEstimateGasFee
