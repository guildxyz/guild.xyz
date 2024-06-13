import { GUILD_REWARD_NFT_FACTORY_ADDRESSES } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import guildRewardNFTFactoryAbi from "static/abis/guildRewardNFTFactory"
import { useReadContract } from "wagmi"
import { Chain, Chains } from "wagmiConfig/chains"

const useGuildFee = (
  chain: Chain
): { guildFee: bigint; isLoading: boolean; error: any } => {
  const {
    data: guildFee,
    isLoading,
    error,
  } = useReadContract({
    abi: guildRewardNFTFactoryAbi,
    chainId: Chains[chain],
    address: GUILD_REWARD_NFT_FACTORY_ADDRESSES[chain],
    functionName: "fee",
  })

  return {
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    guildFee,
    isLoading,
    error,
  }
}

export default useGuildFee
