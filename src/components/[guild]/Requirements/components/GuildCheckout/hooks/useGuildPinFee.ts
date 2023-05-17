import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"
import useSWRImmutable from "swr/immutable"
import { GUILD_PIN_CONTRACT, NULL_ADDRESS } from "utils/guildCheckout/constants"

const fetchFee = async ([_, chain]): Promise<BigNumber> => {
  if (!GUILD_PIN_CONTRACT[chain]) return undefined

  const provider = new JsonRpcProvider(RPC[chain].rpcUrls[0])
  const contract = new Contract(
    GUILD_PIN_CONTRACT[chain].address,
    GUILD_PIN_CONTRACT[chain].abi,
    provider
  )

  return contract.fee(NULL_ADDRESS)
}

const useGuildPinFee = (): {
  guildPinFee: BigNumber
  isGuildPinFeeLoading: boolean
  guildPinFeeError: any
} => {
  const { chainId } = useWeb3React()

  const {
    data: guildPinFee,
    isValidating: isGuildPinFeeLoading,
    error: guildPinFeeError,
  } = useSWRImmutable(["guildPinFee", Chains[chainId]], fetchFee)

  return {
    guildPinFee,
    isGuildPinFeeLoading,
    guildPinFeeError,
  }
}

export default useGuildPinFee
