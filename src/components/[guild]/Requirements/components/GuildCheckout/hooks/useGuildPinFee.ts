import useGuild from "components/[guild]/hooks/useGuild"
import guildPinAbi from "static/abis/guildPin"
import useSWR from "swr"
import { GUILD_PIN_CONTRACTS } from "utils/guildCheckout/constants"
import { createPublicClient, type Chain as ViemChain } from "viem"
import { wagmiConfig } from "wagmiConfig"
import { Chains, type Chain } from "wagmiConfig/chains"

/**
 * For some reason, `useReadContract` didn't work on Ontology EVM, so we use the
 * simple `publicClient.readContract` action instead
 */
const fetchFee = (chain: Chain) => {
  const publicClient = createPublicClient({
    chain: wagmiConfig.chains.find((c) => Chains[c.id] === chain) as ViemChain,
    transport: wagmiConfig._internal.transports[Chains[chain]],
  })

  return publicClient.readContract({
    abi: guildPinAbi,
    address: GUILD_PIN_CONTRACTS[chain],
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
    data: guildPinFee,
    isLoading: isGuildPinFeeLoading,
    error: guildPinFeeError,
  } = useSWR(["fee", guildPin.chain], ([_, c]) => fetchFee(c as Chain))

  // const {
  //   data,
  //   isLoading: isGuildPinFeeLoading,
  //   error: guildPinFeeError,
  // } = useReadContract({
  //   abi: guildPinAbi,
  //   address: GUILD_PIN_CONTRACTS[guildPin.chain],
  //   functionName: "fee",
  //   chainId: Chains[guildPin.chain],
  // })

  return {
    guildPinFee,
    isGuildPinFeeLoading,
    guildPinFeeError,
  }
}

export default useGuildPinFee
