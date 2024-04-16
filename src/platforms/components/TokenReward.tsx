import { Spinner } from "@chakra-ui/react"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import {
  TokenRewardProvider,
  useTokenRewardContext,
} from "platforms/Token/TokenRewardContext"
import { useCalculateFromDynamic } from "platforms/Token/hooks/useCalculateToken"
import { RolePlatform } from "types"

const TokenReward = ({ platform }: { platform: RolePlatform }) => {
  const { isTokenLoading, token, rewardImageUrl } = useTokenRewardContext()

  const { getValue } = useCalculateFromDynamic(platform.dynamicAmount)
  const claimableAmount = getValue()

  return (
    <RewardDisplay
      icon={
        isTokenLoading ? (
          <Spinner boxSize={6} />
        ) : (
          <RewardIcon
            rolePlatformId={platform.id}
            guildPlatform={platform?.guildPlatform}
            owerwriteImg={rewardImageUrl}
          />
        )
      }
      label={`Claim: ${claimableAmount || ""} ${token?.symbol || "tokens"}`}
    />
  )
}

const TokenRewardWrapper = ({ platform }: RewardProps) => {
  return (
    <TokenRewardProvider
      tokenReward={{
        chain: platform?.guildPlatform?.platformGuildData?.chain,
        address: platform?.guildPlatform?.platformGuildData?.contractAddress,
        rewardsByRoles: [
          {
            rewards: [
              { rolePlatform: platform, guildPlatform: platform?.guildPlatform },
            ],
          },
        ],
      }}
    >
      <TokenReward platform={platform} />
    </TokenRewardProvider>
  )
}

export default TokenRewardWrapper
