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
import dynamic from "next/dynamic"
import { StarHalf } from "phosphor-react"
import platforms from "platforms/platforms"
import PoapCardMenu from "platforms/Poap/PoapCardMenu"
import { PlatformName, PlatformType } from "types"
import PoapRewardCard from "../CreatePoap/components/PoapRewardCard"
import useGroup from "../hooks/useGroup"
import useGuild from "../hooks/useGuild"
import useGuildPermission from "../hooks/useGuildPermission"
import useIsMember from "../hooks/useIsMember"
import PlatformCard from "../RolePlatforms/components/PlatformCard"
import PlatformAccessButton from "./components/PlatformAccessButton"
import RoleGroupCards from "./components/RoleGroupCards"

const DynamicGuildPinRewardCard = dynamic(
  () => import("./components/GuildPinRewardCard")
)

export const useAccessedGuildPlatforms = (groupId?: number) => {
  const { id, guildPlatforms, roles } = useGuild()
  const relevantRoles = groupId
    ? roles.filter((role) => role.groupId === groupId)
    : roles.filter((role) => !role.groupId)

  const relevantGuildPlatformIds = relevantRoles.flatMap((role) =>
    role.rolePlatforms.map((rp) => rp.guildPlatformId)
  )
  const relevantGuildPlatforms = guildPlatforms.filter((gp) =>
    relevantGuildPlatformIds.includes(gp.id)
  )

  const { isAdmin } = useGuildPermission()
  const { memberships } = useMemberships()

  // Displaying CONTRACT_CALL rewards for everyone, even for users who aren't members
  const contractCallGuildPlatforms =
    relevantGuildPlatforms?.filter(
      (guildPlatform) => guildPlatform.platformId === PlatformType.CONTRACT_CALL
    ) ?? []

  if (isAdmin) return relevantGuildPlatforms

  const accessedRoleIds = memberships?.find(
    (membership) => membership.guildId === id
  )?.roleIds
  if (!accessedRoleIds) return contractCallGuildPlatforms

  const accessedRoles = roles.filter((role) => accessedRoleIds.includes(role.id))
  const accessedRolePlatforms = accessedRoles
    .map((role) => role.rolePlatforms)
    .flat()
    .filter((rolePlatform) => !!rolePlatform)
  const accessedGuildPlatformIds = [
    ...new Set(
      accessedRolePlatforms.map((rolePlatform) => rolePlatform.guildPlatformId)
    ),
  ]
  const accessedGuildPlatforms = relevantGuildPlatforms?.filter(
    (guildPlatform) =>
      accessedGuildPlatformIds.includes(guildPlatform.id) ||
      guildPlatform.platformId === PlatformType.CONTRACT_CALL
  )

  return accessedGuildPlatforms
}

const AccessHub = (): JSX.Element => {
  const { id: guildId, poaps, featureFlags, guildPin, groups } = useGuild()

  const group = useGroup()

  const accessedGuildPlatforms = useAccessedGuildPlatforms(group?.id)
  const { isAdmin } = useGuildPermission()
  const isMember = useIsMember()

  const futurePoaps = poaps?.filter((poap) => {
    const currentTime = Date.now() / 1000
    return poap.expiryDate > currentTime
  })

  const shouldShowGuildPin =
    !group &&
    featureFlags.includes("GUILD_CREDENTIAL") &&
    ((isMember && guildPin?.isActive) || isAdmin)

  const showNoAccessedRewards =
    isMember &&
    (!featureFlags.includes("GUILD_CREDENTIAL") || !shouldShowGuildPin) &&
    (group ? true : !groups?.length)

  const marginBottom =
    !accessedGuildPlatforms?.length &&
    !futurePoaps?.length &&
    !showNoAccessedRewards &&
    !groups?.length
      ? 0
      : 10

  return (
    <SimpleGrid
      templateColumns={{
        base: "repeat(auto-fit, minmax(250px, 1fr))",
        md: "repeat(auto-fit, minmax(250px, .5fr))",
      }}
      gap={4}
      mb={marginBottom}
    >
      <RoleGroupCards />
      {guildId === 1985 && shouldShowGuildPin && <DynamicGuildPinRewardCard />}
      {accessedGuildPlatforms?.length || futurePoaps?.length ? (
        <>
          {accessedGuildPlatforms.map((platform) => {
            if (!platforms[PlatformType[platform.platformId]]) return null

            const {
              cardPropsHook: useCardProps,
              cardMenuComponent: PlatformCardMenu,
              cardWarningComponent: PlatformCardWarning,
              cardButton: PlatformCardButton,
            } = platforms[PlatformType[platform.platformId] as PlatformName]

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
                {PlatformCardButton ? (
                  <PlatformCardButton platform={platform} />
                ) : (
                  <PlatformAccessButton platform={platform} />
                )}
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
      ) : showNoAccessedRewards ? (
        <Card>
          <Alert status="info" h="full">
            <Icon as={StarHalf} boxSize="5" mr="2" mt="1px" weight="regular" />
            <Stack>
              <AlertTitle>No accessed reward</AlertTitle>
              <AlertDescription>
                You're a member of the guild, but your roles don't give you any
                auto-managed rewards. The owner might add some in the future or
                reward you another way!
              </AlertDescription>
            </Stack>
          </Alert>
        </Card>
      ) : null}
      {guildId !== 1985 && shouldShowGuildPin && <DynamicGuildPinRewardCard />}
    </SimpleGrid>
  )
}

export default AccessHub
