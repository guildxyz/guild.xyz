import { consts } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import guildPinAbi from "static/abis/guildPin"
import useSWR from "swr"
import { isGuildPinSupportedChain } from "utils/guildCheckout/utils"
import { type Chain as ViemChain, createPublicClient } from "viem"
import { wagmiConfig } from "wagmiConfig"
import { type Chain, Chains } from "wagmiConfig/chains"

/**
 * For some reason, `useReadContract` didn't work on Ontology EVM, so we use the
 * simple `publicClient.readContract` action instead
 */
const fetchFee = (chain: Chain) => {
  if (!isGuildPinSupportedChain(chain)) throw new Error("Unsupported chain")

  const publicClient = createPublicClient({
    chain: wagmiConfig.chains.find((c) => Chains[c.id] === chain) as ViemChain,
    transport: wagmiConfig._internal.transports[Chains[chain]],
  })

  return publicClient.readContract({
    abi: guildPinAbi,
    address: consts.PinContractAddresses[chain],
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
  } = useSWR(["fee", guildPin?.chain], ([_, c]) => fetchFee(c as Chain))

  // const {
  //   data,
  //   isLoading: isGuildPinFeeLoading,
  //   error: guildPinFeeError,
  // } = useReadContract({
  //   abi: guildPinAbi,
  //   address: consts.PinContractAddresses[guildPin.chain],
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
