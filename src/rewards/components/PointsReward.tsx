import { Link } from "@chakra-ui/next-js"
import { Icon, Tooltip, useColorModeValue } from "@chakra-ui/react"
import { ArrowRight, Check } from "@phosphor-icons/react"
import DynamicTag from "components/[guild]/RoleCard/components/DynamicReward/DynamicTag"
import { RewardIcon } from "components/[guild]/RoleCard/components/Reward"
import { RewardDisplay } from "components/[guild]/RoleCard/components/RewardDisplay"
import { RewardProps } from "components/[guild]/RoleCard/components/types"
import useGuild from "components/[guild]/hooks/useGuild"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import useDynamicRewardUserAmount from "rewards/Token/hooks/useDynamicRewardUserAmount"

const PointsReward = ({ platform }: RewardProps) => {
  const { urlName } = useGuild()
  const { platformGuildData } = platform.guildPlatform
  const name = platformGuildData?.name || "points"

  const { hasRoleAccess } = useRoleMembership(platform.roleId)
  const { dynamicUserAmount } = useDynamicRewardUserAmount(platform)

  const score = platform?.dynamicAmount
    ? (dynamicUserAmount ?? "some")
    : platform.platformRoleData?.score

  const iconColor = useColorModeValue("green.500", "green.300")

  return (
    <RewardDisplay
      icon={
        <RewardIcon
          rolePlatformId={platform.id}
          guildPlatform={platform?.guildPlatform}
        />
      }
      label={
        <>
          {`Get: `}
          <Tooltip
            label={
              <>
                {!hasRoleAccess &&
                  `You'll automatically get ${name} if you satisfy the role. `}
                View leaderboard <Icon as={ArrowRight} mb="-0.5" />
              </>
            }
            shouldWrapChildren
            hasArrow
          >
            <Link
              href={`/${urlName}/leaderboard/${platform.guildPlatform.id}`}
              fontWeight={"semibold"}
            >{`${score ?? 0} ${name}`}</Link>
            {hasRoleAccess && (
              <Icon as={Check} color={iconColor} ml="1.5" mb="-0.5" />
            )}
          </Tooltip>
        </>
      }
      rightElement={
        !!platform.dynamicAmount && <DynamicTag rolePlatform={platform} />
      }
    />
  )
}
export default PointsReward
