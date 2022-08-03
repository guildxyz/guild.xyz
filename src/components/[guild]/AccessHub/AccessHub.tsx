import { SimpleGrid } from "@chakra-ui/react"
import useMemberships from "components/explorer/hooks/useMemberships"
import { PlatformType } from "types"
import useGuild from "../hooks/useGuild"
import useGuildPermission from "../hooks/useGuildPermission"
import DiscordCard from "../RolePlatforms/components/PlatformCard/components/DiscordCard"
import GithubCard from "../RolePlatforms/components/PlatformCard/components/GithubCard"
import GoogleCard from "../RolePlatforms/components/PlatformCard/components/GoogleCard"
import TelegramCard from "../RolePlatforms/components/PlatformCard/components/TelegramCard"
import PlatformCardButton from "./components/PlatformCardButton"

const PlatformComponents = {
  DISCORD: DiscordCard,
  TELEGRAM: TelegramCard,
  GITHUB: GithubCard,
  GOOGLE: GoogleCard,
}

// prettier-ignore
const useAccessedGuildPlatforms = () => {
  const { id, guildPlatforms, roles } = useGuild()
  const { isOwner } = useGuildPermission()
  const memberships = useMemberships()

  if (isOwner) return guildPlatforms
  
  const accessedRoleIds = memberships?.find((membership) => membership.guildId === id)?.roleIds
  if (!accessedRoleIds) return []

  const accessedRoles = roles.filter(role => accessedRoleIds.includes(role.id))
  const accessedRolePlatforms = accessedRoles.map(role => role.rolePlatforms).flat().filter(rolePlatform => !!rolePlatform)
  const accessedGuildPlatformIds = [...new Set(accessedRolePlatforms.map(rolePlatform => rolePlatform.guildPlatformId))]
  const accessedGuildPlatforms = guildPlatforms.filter(guildPlatform => accessedGuildPlatformIds.includes(guildPlatform.id))

  return accessedGuildPlatforms
}

const AccessHub = (): JSX.Element => {
  const accessedGuildPlatforms = useAccessedGuildPlatforms()

  return (
    <SimpleGrid
      templateColumns={{
        base: "repeat(auto-fit, minmax(250px, 1fr))",
        md: "repeat(auto-fit, minmax(250px, .5fr))",
      }}
      gap={4}
      mb="10"
    >
      {accessedGuildPlatforms?.map((platform) => {
        const PlatformComponent =
          PlatformComponents[PlatformType[platform.platformId]]

        return (
          <PlatformComponent key={platform.id} guildPlatform={platform} colSpan={1}>
            <PlatformCardButton platform={platform} />
          </PlatformComponent>
        )
      })}
    </SimpleGrid>
  )
}

export default AccessHub
