import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcBatchProvider } from "@ethersproject/providers"
import { GUILD_REWARD_NFT_FACTORY_ADDRESSES } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import { Chain, Chains, RPC } from "connectors"
import GUILD_REWARD_NFT_FACTORY_ABI from "static/abis/guildRewardNFTFactory.json"
import useSWRImmutable from "swr/immutable"

const fetchGuildFee = async ([_, chain]) => {
  const provider = new JsonRpcBatchProvider(RPC[chain].rpcUrls[0], Chains[chain])
  const contract = new Contract(
    GUILD_REWARD_NFT_FACTORY_ADDRESSES[chain],
    GUILD_REWARD_NFT_FACTORY_ABI,
    provider
  )

  return contract.fee()
}

const useGuildFee = (
  chain: Chain
): { guildFee: BigNumber; isLoading: boolean; error: any } => {
  const {
    data: guildFee,
    isLoading,
    error,
  } = useSWRImmutable(chain ? ["guildFee", chain] : null, fetchGuildFee)

  return {
    guildFee,
    isLoading,
    error,
  }
}

export default useGuildFee
