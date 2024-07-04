import { Circle, Img, useColorModeValue } from "@chakra-ui/react"
import AvailabilityTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useGuild from "components/[guild]/hooks/useGuild"
import { GuildPlatform, PlatformName } from "types"
import { gatherData } from "./data"
import { CardPropsHook } from "rewards/types"

const useGatherCardProps: CardPropsHook = (guildPlatform: GuildPlatform) => {
  const bgColor = useColorModeValue("gray.700", "gray.600")

  const { roles } = useGuild()

  const rolePlatform = roles
    ?.flatMap((role) => role.rolePlatforms)
    .find((rp) => rp.guildPlatformId === guildPlatform.id)
  return {
    name: guildPlatform.platformGuildData?.name ?? gatherData.name,
    type: "GATHER_TOWN" as PlatformName,
    image: (
      <Circle size={10} bgColor={bgColor} overflow="hidden">
        <Img src={gatherData.imageUrl} boxSize={10} color="white" />
      </Circle>
    ),
    info: rolePlatform ? (
      <AvailabilityTags rolePlatform={rolePlatform} mt={1} />
    ) : undefined,
  }
}

export const gatherSpaceIdToName = (spaceId: string) => {
  if (!spaceId) return ""
  return decodeURIComponent(spaceId.split("\\")[1])
}

export const gatherSpaceUrlToSpaceId = (spaceUrl: string) => {
  const relevantSection = decodeURIComponent(spaceUrl).slice(
    "https://app.gather.town/app/".length
  )

  // according to docs, forward slashes in spaceId need to be replaced by backslashes
  // https://gathertown.notion.site/Gather-HTTP-API-3bbf6c59325f40aca7ef5ce14c677444#3c526203a2d543879841dae77dbe3ed5
  return relevantSection.replace("/", "\\")
}

export default useGatherCardProps
