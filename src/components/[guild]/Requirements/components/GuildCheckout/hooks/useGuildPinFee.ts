import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import useGuild from "components/[guild]/hooks/useGuild"
import { RPC } from "connectors"
import useSWRImmutable from "swr/immutable"
import { GUILD_PIN_CONTRACTS, NULL_ADDRESS } from "utils/guildCheckout/constants"

const fetchFee = async ([_, chain]): Promise<BigNumber> => {
  const provider = new JsonRpcProvider(RPC[chain].rpcUrls[0])
  const contract = new Contract(
    GUILD_PIN_CONTRACTS[chain].address,
    GUILD_PIN_CONTRACTS[chain].abi,
    provider
  )

  return contract.fee(NULL_ADDRESS)
}

const useGuildPinFee = (): {
  guildPinFee: BigNumber
  isGuildPinFeeLoading: boolean
  guildPinFeeError: any
} => {
  const { id, guildPin } = useGuild()

  const {
    data: guildPinFee,
    isValidating: isGuildPinFeeLoading,
    error: guildPinFeeError,
  } = useSWRImmutable<BigNumber>(["guildPinFee", guildPin.chain, id], fetchFee)

  return {
    guildPinFee,
    isGuildPinFeeLoading,
    guildPinFeeError,
  }
}

export default useGuildPinFee
