import { ContractCallFunction } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import AvailabilityTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useNftBalance from "hooks/useNftBalance"
import { GuildPlatformWithOptionalId, PlatformName } from "types"
import { Chains } from "wagmiConfig/chains"
import NftAvailabilityTags from "./components/NftAvailabilityTags"

const useContractCallCardProps = (guildPlatform: GuildPlatformWithOptionalId) => {
  const { roles } = useGuild()
  const { isAdmin } = useGuildPermission()
  const {
    chain,
    contractAddress,
    function: contractCallFunction,
  } = guildPlatform.platformGuildData
  const { name, image } = useNftDetails(chain, contractAddress)

  const { data: nftBalance } = useNftBalance({
    nftAddress: contractAddress,
    chainId: Chains[chain],
  })
  const alreadyCollected = nftBalance > 0

  const rolePlatform = roles
    .flatMap((role) => role.rolePlatforms)
    .find((rp) => rp.guildPlatformId === guildPlatform.id)

  return {
    type: "CONTRACT_CALL" as PlatformName,
    name: name || guildPlatform.platformGuildData?.name,
    image: image || guildPlatform.platformGuildData?.imageUrl,
    info:
      rolePlatform &&
      (contractCallFunction === ContractCallFunction.DEPRECATED_SIMPLE_CLAIM ? (
        <AvailabilityTags rolePlatform={rolePlatform} mt={1} />
      ) : (
        <NftAvailabilityTags
          guildPlatform={guildPlatform}
          rolePlatform={rolePlatform}
        />
      )),
    shouldHide: !isAdmin && alreadyCollected,
  }
}

export default useContractCallCardProps
