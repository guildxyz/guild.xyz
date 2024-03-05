import { CHAIN_CONFIG, Chain } from "chains"
import useGuild from "components/[guild]/hooks/useGuild"
import useSWR from "swr"
import { GUILD_PIN_CONTRACTS } from "utils/guildCheckout/constants"
import { Chain as ViemChain, createPublicClient, http } from "viem"

/** TODO: check if the `useReadContract` works properly on Ontology EVM in wagmi 2.0 */
const fetchFee = (chain: Chain) => {
  const publicClient = createPublicClient({
    transport: http(),
    chain: CHAIN_CONFIG[chain] as ViemChain,
  })

  return publicClient.readContract({
    abi: GUILD_PIN_CONTRACTS[chain].abi,
    address: GUILD_PIN_CONTRACTS[chain].address,
    functionName: "fee",
  })
}

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
  } = useSWR(["fee", guildPin.chain], ([_, c]) => fetchFee(c as Chain))

  // const {
  //   data,
  //   isLoading: isGuildPinFeeLoading,
  //   error: guildPinFeeError,
  // } = useReadContract({
  //   abi: GUILD_PIN_CONTRACTS[guildPin.chain].abi,
  //   address: GUILD_PIN_CONTRACTS[guildPin.chain].address,
  //   functionName: "fee",
  // })

  return {
    guildPinFee: data as unknown as bigint,
    isGuildPinFeeLoading,
    guildPinFeeError,
  }
}

export default useGuildPinFee
