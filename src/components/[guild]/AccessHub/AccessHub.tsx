import {
  Alert,
  AlertDescription,
  AlertTitle,
  Icon,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import useMemberships from "components/explorer/hooks/useMemberships"
import { StarHalf } from "phosphor-react"
import platforms from "platforms/platforms"
import PoapCardMenu from "platforms/Poap/PoapCardMenu"
import { PlatformType } from "types"
import PoapRewardCard from "../CreatePoap/components/PoapRewardCard"
import useGuild from "../hooks/useGuild"
import useGuildPermission from "../hooks/useGuildPermission"
import useIsMember from "../hooks/useIsMember"
import PlatformCard from "../RolePlatforms/components/PlatformCard"
import GuildCredentialRewardCard from "./components/GuildCredentialRewardCard"
import PlatformCardButton from "./components/PlatformCardButton"

// prettier-ignore
const useAccessedGuildPlatforms = () => {
  const { id, guildPlatforms, roles } = useGuild()
  const { isAdmin } = useGuildPermission()
  const { memberships } = useMemberships()

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
  const { id: guildId, poaps } = useGuild()
  const accessedGuildPlatforms = useAccessedGuildPlatforms()
  const { isAdmin } = useGuildPermission()
  const isMember = useIsMember()

  const futurePoaps = poaps?.filter((poap) => {
    const currentTime = Date.now() / 1000
    return poap.expiryDate > currentTime
  })

  return (
    <SimpleGrid
      templateColumns={{
        base: "repeat(auto-fit, minmax(250px, 1fr))",
        md: "repeat(auto-fit, minmax(250px, .5fr))",
      }}
      gap={4}
      mb="10"
    >
      {accessedGuildPlatforms?.length || futurePoaps?.length ? (
        <>
          {accessedGuildPlatforms.map((platform) => {
            const {
              cardPropsHook: useCardProps,
              cardMenuComponent: PlatformCardMenu,
              cardWarningComponent: PlatformCardWarning,
            } = platforms[PlatformType[platform.platformId]]

            return (
              <PlatformCard
                usePlatformProps={useCardProps}
                guildPlatform={platform}
                key={platform.id}
                cornerButton={
                  isAdmin && PlatformCardMenu ? (
                    <PlatformCardMenu platformGuildId={platform.platformGuildId} />
                  ) : PlatformCardWarning ? (
                    <PlatformCardWarning guildPlatform={platform} />
                  ) : null
                }
              >
                <PlatformCardButton platform={platform} />
              </PlatformCard>
            )
          })}

          {/* Custom logic for Chainlink */}
          {(isAdmin || guildId !== 16389) &&
            futurePoaps.map((poap) => (
              <PoapRewardCard
                key={poap?.id}
                guildPoap={poap}
                cornerButton={isAdmin && <PoapCardMenu guildPoap={poap} />}
              />
            ))}
        </>
      ) : (
        <Card>
          <Alert status="info" h="full">
            <Icon as={StarHalf} boxSize="5" mr="2" mt="1px" weight="regular" />
            <Stack>
              <AlertTitle>No accessed reward</AlertTitle>
              <AlertDescription>
                You're member of the guild, but your roles don't give you any
                auto-managed rewards. The owner might add some in the future or
                reward you another way!
              </AlertDescription>
            </Stack>
          </Alert>
        </Card>
      )}
      {isMember && <GuildCredentialRewardCard />}
    </SimpleGrid>
  )
}

export default AccessHub
