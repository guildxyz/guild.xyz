import { Icon, Tooltip, useColorModeValue } from "@chakra-ui/react"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import Link from "components/common/Link"
import { ArrowRight, Check } from "phosphor-react"

const ScoreReward = ({ platform, withMotionImg }: RewardProps) => {
  const { urlName } = useGuild()
  const { platformGuildData } = platform.guildPlatform
  const name = platformGuildData?.name || "points"

  const { hasAccess } = useAccess(platform.roleId)

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
                {!hasAccess &&
                  `You'll automatically get ${name} if you satisfy the role. `}
                View leaderboard <Icon as={ArrowRight} mb="-0.5" />
              </>
            }
            shouldWrapChildren
            hasArrow
          >
            <Link
              href={`/${urlName}/leaderboard`}
              fontWeight={"semibold"}
            >{`${platform.platformRoleData?.score} ${name}`}</Link>
            {hasAccess && <Icon as={Check} color={iconColor} ml="1.5" mb="-0.5" />}
          </Tooltip>
        </>
      }
    />
  )
}
export default ScoreReward
