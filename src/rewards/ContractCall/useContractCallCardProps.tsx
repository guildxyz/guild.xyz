import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import { CardPropsHook } from "rewards/types"
import { GuildPlatformWithOptionalId, PlatformName } from "types"
import NftAvailabilityTags from "./components/NftAvailabilityTags"

const useContractCallCardProps: CardPropsHook = (
  guildPlatform: GuildPlatformWithOptionalId
) => {
  const { roles } = useGuild()
  const { chain, contractAddress } = guildPlatform.platformGuildData
  const { name, image } = useNftDetails(chain, contractAddress)

  const rolePlatform = roles
    ?.flatMap((role) => role.rolePlatforms)
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
  }
}

export default useContractCallCardProps
