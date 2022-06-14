import FEE_COLLECTOR_ABI from "static/abis/feeCollectorAbi.json"
import useContract from "./useContract"

const useFeeCollectorContract = () =>
  useContract("0xCc1EAfB95D400c1E762f8D4C85F1382343787D7C", FEE_COLLECTOR_ABI, true)

export default useFeeCollectorContract
