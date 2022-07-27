import { SimpleGrid } from "@chakra-ui/react"
import Button from "components/common/Button"
import LinkButton from "components/common/LinkButton"
import useMemberships from "components/explorer/hooks/useMemberships"
import { PlatformType } from "types"
import useGuild from "../hooks/useGuild"
import DiscordCard from "../RolePlatforms/components/PlatformCard/components/DiscordCard"
import GoogleCard from "../RolePlatforms/components/PlatformCard/components/GoogleCard"
import TelegramCard from "../RolePlatforms/components/PlatformCard/components/TelegramCard"

const PlatformComponents = {
  DISCORD: DiscordCard,
  TELEGRAM: TelegramCard,
  GOOGLE: GoogleCard,
}

const platformTypeButtonLabel = {
  DISCORD: "Visit server",
  TELEGRAM: "Visit group",
  GOOGLE: "Open document",
}

// prettier-ignore
const useAccessedGuildPlatforms = () => {
  const { id, guildPlatforms, roles } = useGuild()
  const memberships = useMemberships()
  
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
            {platform.invite ? (
              <LinkButton
                mt={6}
                h={10}
                href={platform.invite}
                colorScheme={PlatformType[platform.platformId]}
              >
                {platformTypeButtonLabel[PlatformType[platform.platformId]]}
              </LinkButton>
            ) : (
              <Button
                mt={6}
                h={10}
                colorScheme={PlatformType[platform.platformId]}
                isDisabled
              >
                Couldn't fetch invite.
              </Button>
            )}
          </PlatformComponent>
        )
      })}
    </SimpleGrid>
  )
}

export default AccessHub
