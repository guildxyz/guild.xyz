import { SimpleGrid } from "@chakra-ui/react"
import useMemberships from "components/explorer/hooks/useMemberships"
import platforms from "platforms"
import { PlatformType } from "types"
import useGuild from "../hooks/useGuild"
import useGuildPermission from "../hooks/useGuildPermission"
import PlatformCardButton from "./components/PlatformCardButton"

// prettier-ignore
const useAccessedGuildPlatforms = () => {
  const { id, guildPlatforms, roles } = useGuild()
  const { isAdmin } = useGuildPermission()
  const memberships = useMemberships()

  if (isAdmin) return guildPlatforms
  
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
  const { isAdmin } = useGuildPermission()

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
        const { cardComponent: PlatformCard, cardMenuComponent: PlatformCardMenu } =
          platforms[PlatformType[platform.platformId]]

        return (
          <PlatformCard
            key={platform.id}
            guildPlatform={platform}
            cornerButton={
              isAdmin &&
              PlatformCardMenu && (
                <PlatformCardMenu platformGuildId={platform.platformGuildId} />
              )
            }
          >
            <PlatformCardButton platform={platform} />
          </PlatformCard>
        )
      })}
    </SimpleGrid>
  )
}

export default AccessHub
