import useGuild from "components/[guild]/hooks/useGuild"
import guildPinAbi from "static/abis/guildPin"
import { GUILD_PIN_CONTRACTS } from "utils/guildCheckout/constants"
import { useReadContract } from "wagmi"
import { Chains } from "wagmiConfig/chains"

const useGuildPinFee = (): {
  guildPinFee: bigint
  isGuildPinFeeLoading: boolean
  guildPinFeeError: Error
} => {
  const { guildPin } = useGuild()

  const {
    data,
    isLoading: isGuildPinFeeLoading,
    error: guildPinFeeError,
  } = useReadContract({
    abi: guildPinAbi,
    address: GUILD_PIN_CONTRACTS[guildPin.chain],
    functionName: "fee",
    chainId: Chains[guildPin.chain],
  })

  return {
    guildPinFee: data as unknown as bigint,
    isGuildPinFeeLoading,
    guildPinFeeError,
  }
}

export default useGuildPinFee
