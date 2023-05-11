import FEE_COLLECTOR_ABI from "static/abis/legacyPoapFeeCollectorAbi.json"
import useContract from "./useContract"

const FEE_COLLECTOR_ADDRESS = "0x8c82A71B629DB618847682cD3155e6742304B710"

const useFeeCollectorContract = () =>
  useContract(FEE_COLLECTOR_ADDRESS, FEE_COLLECTOR_ABI, true)

export default useFeeCollectorContract
export { FEE_COLLECTOR_ADDRESS }
