import { useWeb3React } from "@web3-react/core"
import useReverseDotbitName from "./useReverseDotbitName"
import useReverseLensProtocol from "./useReverseLensProtocol"
import useReverseNNSName from "./useReverseNNSName"
import useReverseUnstoppableDomain from "./useReverseUnstoppableDomain"
const ReverseResolve = () => {
  const { provider, account } = useWeb3React()
  const NNSAddress = useReverseNNSName(provider, "nnsregistry.⌐◨-◨")
  const dotbitAddress = useReverseDotbitName("imac.bit")
  const unstoppableDomainAddress = useReverseUnstoppableDomain("ladyinred.x") // gives back another address
  const lensAddress = useReverseLensProtocol("ladidaix.lens")
}

export default ReverseResolve
