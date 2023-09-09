import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import { Chain, Chains, RPC } from "connectors"
import useSWRImmutable from "swr/immutable"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import useGuildPinContractsData from "./useGuildPinContractsData"

const fetchFee = async (
  chain,
  contractsData: Partial<Record<Chain, { address: string; abi: any }>>
): Promise<BigNumber> => {
  if (!contractsData[chain]) return undefined

  const provider = new JsonRpcProvider(RPC[chain].rpcUrls[0])
  const contract = new Contract(
    contractsData[chain].address,
    contractsData[chain].abi,
    provider
  )

  return contract.fee(NULL_ADDRESS)
}

const useGuildPinFee = (): {
  guildPinFee: BigNumber
  isGuildPinFeeLoading: boolean
  guildPinFeeError: any
} => {
  const { id } = useGuild()
  const { chainId } = useWeb3React()
  const guildPinContractsData = useGuildPinContractsData()

  const {
    data: guildPinFee,
    isValidating: isGuildPinFeeLoading,
    error: guildPinFeeError,
  } = useSWRImmutable(["guildPinFee", Chains[chainId], id], ([_, chain]) =>
    fetchFee(chain, guildPinContractsData)
  )

  return {
    guildPinFee,
    isGuildPinFeeLoading,
    guildPinFeeError,
  }
}

export default useGuildPinFee
