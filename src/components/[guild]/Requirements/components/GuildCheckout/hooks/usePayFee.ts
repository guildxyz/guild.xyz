import { useWeb3React } from "@web3-react/core"
import { Chains } from "connectors"
import useContract from "hooks/useContract"
import useEstimateGasFee from "hooks/useEstimateGasFee"
import FEE_COLLECTOR_ABI from "static/abis/newFeeCollectorAbi.json"
import { FEE_COLLECTOR_CONTRACT } from "utils/guildCheckout/constants"
import { useGuildCheckoutContext } from "../components/GuildCheckoutContex"

const usePayFee = () => {
  const { chainId } = useWeb3React()

  const { requirement } = useGuildCheckoutContext()

  const feeCollectorContract = useContract(
    FEE_COLLECTOR_CONTRACT[Chains[chainId]],
    FEE_COLLECTOR_ABI,
    true
  )

  const { estimatedGasFee, estimatedGasFeeInUSD, estimateGasError } =
    useEstimateGasFee(
      requirement?.id?.toString(),
      requirement?.chain === Chains[chainId] ? feeCollectorContract : null,
      "payFee",
      [requirement.data.id]
    )

  return {
    // ...useSubmitData,
    // onSubmit: () => useSubmitData.onSubmit(generatedGetAssetsParams),
    estimatedGasFee,
    estimatedGasFeeInUSD,
    estimateGasError,
  }
}

export default usePayFee
