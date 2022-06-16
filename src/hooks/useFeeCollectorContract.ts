import { useWeb3React } from "@web3-react/core"
import FEE_COLLECTOR_ABI from "static/abis/feeCollectorAbi.json"
import useContract from "./useContract"

enum FeeCollectorChain {
  "0xCc1EAfB95D400c1E762f8D4C85F1382343787D7C" = 5,
}

const useFeeCollectorContract = () => {
  const { chainId } = useWeb3React()
  return useContract(FeeCollectorChain[chainId], FEE_COLLECTOR_ABI, true)
}

export default useFeeCollectorContract
export { FeeCollectorChain }
