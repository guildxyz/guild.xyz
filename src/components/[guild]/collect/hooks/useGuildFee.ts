import { GUILD_REWARD_NFT_FACTORY_ADDRESSES } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import { Chain, Chains } from "connectors"
import guildRewardNFTFactoryAbi from "static/abis/guildRewardNFTFactory"
import { useContractRead } from "wagmi"

const useGuildFee = (
  chain: Chain
): { guildFee: bigint; isLoading: boolean; error: any } => {
  const {
    data: guildFee,
    isLoading,
    error,
  } = useContractRead({
    abi: guildRewardNFTFactoryAbi,
    chainId: Chains[chain],
    address: GUILD_REWARD_NFT_FACTORY_ADDRESSES[chain],
    functionName: "fee",
  })

  return {
    guildFee,
    isLoading,
    error,
  }
}

export default useGuildFee
