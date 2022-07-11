import { useWeb3React } from "@web3-react/core"
import FEE_COLLECTOR_ABI from "static/abis/feeCollectorAbi.json"
import useContract from "./useContract"

enum FeeCollectorChain {
  "0x8c82A71B629DB618847682cD3155e6742304B710" = 5,
}

const useFeeCollectorContract = () => {
  const { chainId } = useWeb3React()
  return useContract(FeeCollectorChain[chainId], FEE_COLLECTOR_ABI, true)
}

export default useFeeCollectorContract
export { FeeCollectorChain }
