import AvailabilityTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import { GuildPlatform, PlatformName } from "types"

const useContractCallCardProps = (guildPlatform: GuildPlatform) => {
  const { roles } = useGuild()
  const { chain, contractAddress } = guildPlatform.platformGuildData
  const { name, image } = useNftDetails(chain, contractAddress)

  const rolePlatform = roles
    .flatMap((role) => role.rolePlatforms)
    .find((rp) => rp.guildPlatformId === guildPlatform.id)

  return {
    type: "CONTRACT_CALL" as PlatformName,
    name: name || guildPlatform.platformGuildData?.name,
    image: image || guildPlatform.platformGuildData?.imageUrl,
    info: rolePlatform && <AvailabilityTags rolePlatform={rolePlatform} mt={1} />,
  }
}

export default useContractCallCardProps
