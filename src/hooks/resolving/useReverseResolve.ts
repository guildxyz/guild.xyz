import { useWeb3React } from "@web3-react/core"
import useReverseDotbitName from "./useReverseDotbitName"
import useReverseENSName from "./useReverseENSName"
import useReverseLensProtocol from "./useReverseLensProtocol"
import useReverseNNSName from "./useReverseNNSName"
import useReverseUnstoppableDomain from "./useReverseUnstoppableDomain"
const useReverseResolve = (domain) => {
  const { provider } = useWeb3React()
  const { data: ENSAddress } = useReverseENSName(domain)
  const { data: NNSAddress } = useReverseNNSName(provider, domain)
  const { data: dotbitAddress, error: dotbitError } = useReverseDotbitName(domain)
  const { data: unstoppableDomainAddress, error: unstoppableDomainError } =
    useReverseUnstoppableDomain(domain)
  const { data: lensAddress, error: lensError } = useReverseLensProtocol(domain)

  return {
    resolvedAddress:
      NNSAddress ||
      ENSAddress ||
      lensAddress ||
      unstoppableDomainAddress ||
      dotbitAddress,
    error:
      ENSAddress === null &&
      NNSAddress === null &&
      lensError &&
      unstoppableDomainError &&
      dotbitError,
  }
}

export default useReverseResolve
