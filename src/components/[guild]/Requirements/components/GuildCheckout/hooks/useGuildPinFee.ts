import useGuild from "components/[guild]/hooks/useGuild"
import { GUILD_PIN_CONTRACTS, NULL_ADDRESS } from "utils/guildCheckout/constants"
import { useContractRead } from "wagmi"

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
  } = useContractRead({
    abi: GUILD_PIN_CONTRACTS[guildPin.chain].abi,
    address: GUILD_PIN_CONTRACTS[guildPin.chain].address,
    functionName: "fee",
    args: [NULL_ADDRESS],
  })

  return {
    guildPinFee: data as unknown as bigint,
    isGuildPinFeeLoading,
    guildPinFeeError,
  }
}

export default useGuildPinFee
