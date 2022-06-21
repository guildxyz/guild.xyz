import { useWeb3React } from "@web3-react/core"
import FEE_COLLECTOR_ABI from "static/abis/feeCollectorAbi.json"
import useContract from "./useContract"

enum FeeCollectorChain {
  "0xeeA657619b91CeC1B8F4E82449DBcC7074f68894" = 5,
}

const useFeeCollectorContract = () => {
  const { chainId } = useWeb3React()
  return useContract(FeeCollectorChain[chainId], FEE_COLLECTOR_ABI, true)
}

export default useFeeCollectorContract
export { FeeCollectorChain }
