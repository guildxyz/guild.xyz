import {
  Alert,
  AlertDescription,
  AlertTitle,
  Collapse,
  Icon,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import ClientOnly from "components/common/ClientOnly"
import useMembership from "components/explorer/hooks/useMembership"
import dynamic from "next/dynamic"
import { StarHalf } from "phosphor-react"
import PointsRewardCard from "platforms/Points/PointsRewardCard"
import { TokenRewardCard } from "platforms/Token/TokenRewardCard"
import { PlatformType } from "types"
import useGuild from "../hooks/useGuild"
import useGuildPermission from "../hooks/useGuildPermission"
import useRoleGroup from "../hooks/useRoleGroup"
import AccessedGuildPlatformCard from "./components/AccessedGuildPlatformCard"
import CampaignCards from "./components/CampaignCards"
import { useAccessedGuildPoints } from "./hooks/useAccessedGuildPoints"
import { useTokenRewards } from "./hooks/useTokenRewards"

const DynamicGuildPinRewardCard = dynamic(
  () => import("./components/GuildPinRewardCard")
)

export const useAccessedGuildPlatforms = (groupId?: number) => {
  const { guildPlatforms, roles } = useGuild()
  const { isAdmin } = useGuildPermission()
  const { roleIds } = useMembership()

  const relevantRoles = groupId
    ? roles.filter((role) => role.groupId === groupId)
    : roles.filter((role) => !role.groupId)

  const relevantGuildPlatformIds = relevantRoles.flatMap((role) =>
    role.rolePlatforms.map((rp) => rp.guildPlatformId)
  )
  const relevantGuildPlatforms = guildPlatforms.filter(
    (gp) =>
      relevantGuildPlatformIds.includes(gp.id) &&
      gp.platformId !== PlatformType.POINTS &&
      gp.platformId !== PlatformType.ERC20
  )

  // Displaying CONTRACT_CALL rewards for everyone, even for users who aren't members
  const contractCallGuildPlatforms =
    relevantGuildPlatforms?.filter(
      (guildPlatform) => guildPlatform.platformId === PlatformType.CONTRACT_CALL
    ) ?? []

  if (isAdmin) return relevantGuildPlatforms

  if (!roleIds) return contractCallGuildPlatforms

  const accessedRoles = roles.filter((role) => roleIds.includes(role.id))
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
  const { featureFlags, guildPin, groups, roles, onboardingComplete } = useGuild()

  const group = useRoleGroup()
  const { isAdmin } = useGuildPermission()
  const { isMember } = useMembership()

  const accessedGuildPlatforms = useAccessedGuildPlatforms(group?.id)
  const accessedGuildPoints = useAccessedGuildPoints("ACCESSED_ONLY")
  const accessedGuildTokens = useTokenRewards(!isAdmin)

  const shouldShowGuildPin =
    !group &&
    featureFlags.includes("GUILD_CREDENTIAL") &&
    ((isMember && guildPin?.isActive) || isAdmin)

  const hasVisiblePages = !!groups?.length && roles?.some((role) => !!role.groupId)

  const showAccessHub =
    (isAdmin ? !!onboardingComplete : isMember) ||
    (!!accessedGuildPlatforms?.length && !!onboardingComplete) ||
    (hasVisiblePages && !group)

  return (
    <ClientOnly>
      <Collapse in={showAccessHub} unmountOnExit>
        <SimpleGrid
          templateColumns={{
            base: "repeat(auto-fit, minmax(250px, 1fr))",
            md: "repeat(auto-fit, minmax(250px, .5fr))",
          }}
          gap={4}
          mb={10}
        >
          <CampaignCards />

          {accessedGuildPlatforms?.map((platform) => (
            <AccessedGuildPlatformCard key={platform.id} platform={platform} />
          ))}

          {accessedGuildPoints?.map((pointPlatform) => (
            <PointsRewardCard key={pointPlatform.id} guildPlatform={pointPlatform} />
          ))}

          {accessedGuildTokens?.map((platform) => (
            <TokenRewardCard platform={platform} key={platform.id} />
          ))}

          {(isMember || isAdmin) &&
            (!group ? !groups?.length : true) &&
            !shouldShowGuildPin &&
            !accessedGuildPlatforms?.length &&
            !accessedGuildPoints?.length &&
            !accessedGuildTokens?.length && (
              <Card>
                <Alert status="info" h="full">
                  <Icon as={StarHalf} boxSize="5" mr="2" mt="1px" weight="regular" />
                  <Stack>
                    <AlertTitle>
                      {!group ? "No accessed reward" : "No rewards yet"}
                    </AlertTitle>
                    <AlertDescription>
                      {!group
                        ? "You're a member of the guild, but your roles don't give you any auto-managed rewards. The owner might add some in the future or reward you another way!"
                        : "This page doesn’t have any auto-managed rewards yet. Add some roles below so their rewards will appear here!"}
                    </AlertDescription>
                  </Stack>
                </Alert>
              </Card>
            )}

          {shouldShowGuildPin && <DynamicGuildPinRewardCard />}
        </SimpleGrid>
      </Collapse>
    </ClientOnly>
  )
}

export default AccessHub
