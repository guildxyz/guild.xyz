import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"

const ScoreReward = ({ platform, withMotionImg }: RewardProps) => {
  const { platformGuildData } = platform.guildPlatform

  return (
    <RewardDisplay
      icon={
        <RewardIcon
          rolePlatformId={platform.id}
          guildPlatform={platform?.guildPlatform}
          withMotionImg={withMotionImg}
        />
      }
      label={`Get ${platform.platformRoleData?.score} ${
        platformGuildData?.name || "points"
      }`}
    />
  )
}
export default ScoreReward
