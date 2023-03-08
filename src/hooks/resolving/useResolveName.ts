import { useWeb3React } from "@web3-react/core"
import useUnstoppableDomainName from "hooks/useUnstoppableName"
import useDotbitName from "./useDotbitName"
import useLensProtocolName from "./useLensProtocolName"
import useNNSName from "./useNNSName"

const useResolveName = () => {
  const { provider, account, ENSName } = useWeb3React()

  const NNSName = useNNSName(provider, account)
  const dotbitName = useDotbitName(account)
  const unstoppableDomainName = useUnstoppableDomainName(account)
  const lensName = useLensProtocolName(account)

  return NNSName || ENSName || lensName || unstoppableDomainName || dotbitName
}

export default useResolveName
