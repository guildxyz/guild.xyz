import { useWeb3React } from "@web3-react/core"
import useReverseDotbitName from "./useReverseDotbitName"
import useReverseLensProtocol from "./useReverseLensProtocol"
import useReverseNNSName from "./useReverseNNSName"
import useReverseUnstoppableDomain from "./useReverseUnstoppableDomain"
const useReverseResolve = (domain) => {
  const { provider, account } = useWeb3React() // reverse ENS
  const { data: NNSAddress, error: NNSError } = useReverseNNSName(provider, domain)
  const { data: dotbitAddress, error: dotbitError } = useReverseDotbitName(domain)
  const { data: unstoppableDomainAddress, error: unstoppableDomainError } =
    useReverseUnstoppableDomain(domain)
  const { data: lensAddress, error: lensError } = useReverseLensProtocol(domain)

  return {
    resolvedAddress:
      NNSAddress || lensAddress || unstoppableDomainAddress || dotbitAddress, // ENS MISSING
    error: NNSAddress === null && lensError && unstoppableDomainError && dotbitError,
  }
}

export default useReverseResolve
