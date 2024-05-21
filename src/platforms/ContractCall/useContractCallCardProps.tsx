import useGuildRewardNftBalanceByUserId from "components/[guild]/collect/hooks/useGuildRewardNftBalanceByUserId"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import { GuildPlatformWithOptionalId, PlatformName } from "types"
import { Chains } from "wagmiConfig/chains"
import NftAvailabilityTags from "./components/NftAvailabilityTags"

const useContractCallCardProps = (guildPlatform: GuildPlatformWithOptionalId) => {
  const { roles } = useGuild()
  const { isAdmin } = useGuildPermission()
  const { chain, contractAddress } = guildPlatform.platformGuildData
  const { name, image } = useNftDetails(chain, contractAddress)

  const { data: nftBalance } = useGuildRewardNftBalanceByUserId({
    nftAddress: contractAddress,
    chainId: Chains[chain],
  })
  const alreadyCollected = nftBalance > 0

  const rolePlatform = roles
    .flatMap((role) => role.rolePlatforms)
    .find((rp) => rp.guildPlatformId === guildPlatform.id)

  return {
    type: "CONTRACT_CALL" as PlatformName,
    name,
    image,
    info: rolePlatform && (
      <NftAvailabilityTags
        guildPlatform={guildPlatform}
        rolePlatform={rolePlatform}
        mt={1}
      />
    ),
    shouldHide: !isAdmin && alreadyCollected,
  }
}

export default useContractCallCardProps
