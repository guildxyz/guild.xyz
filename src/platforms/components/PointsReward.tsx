import { Link } from "@chakra-ui/next-js"
import { Icon, Tooltip, Wrap, useColorModeValue } from "@chakra-ui/react"
import DynamicTag from "components/[guild]/RoleCard/components/DynamicReward/DynamicTag"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import useGuild from "components/[guild]/hooks/useGuild"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { ArrowRight, Check } from "phosphor-react"
import { useMemo } from "react"

const PointsReward = ({ platform, withMotionImg }: RewardProps) => {
  const { urlName } = useGuild()
  const { platformGuildData } = platform.guildPlatform
  const name = platformGuildData?.name || "points"

  const { hasRoleAccess, reqAccesses } = useRoleMembership(platform.roleId)

  const score = useMemo(() => {
    const dynamicAmount: any = platform?.dynamicAmount
    if (!dynamicAmount) return platform.platformRoleData?.score

    const { addition, multiplier } = dynamicAmount.operation.params ?? {}
    const linkedRequirementId = dynamicAmount.operation.input[0].requirementId
    const linkedRequirement = reqAccesses?.find(
      (req) => req.requirementId === linkedRequirementId
    )

    if (!linkedRequirement) return "some"

    return linkedRequirement.amount * multiplier + addition
  }, [platform, reqAccesses])

  const iconColor = useColorModeValue("green.500", "green.300")

  return (
    <RewardDisplay
      icon={
        <RewardIcon
          rolePlatformId={platform.id}
          guildPlatform={platform?.guildPlatform}
          withMotionImg={withMotionImg}
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
    >
      {!!platform.dynamicAmount && (
        <Wrap spacing={1}>
          <DynamicTag rolePlatform={platform} />
        </Wrap>
      )}
    </RewardDisplay>
  )
}
export default PointsReward
