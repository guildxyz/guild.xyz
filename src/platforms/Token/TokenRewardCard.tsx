import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import { TokenAccessHubData } from "components/[guild]/AccessHub/hooks/useAccessedTokens"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import RewardCard from "components/common/RewardCard"
import rewards from "platforms/rewards"
import TokenCardButton from "./TokenCardButton"
import { TokenRewardProvider, useTokenRewardContext } from "./TokenRewardContext"
import { useCalculateClaimableTokens } from "./hooks/useCalculateToken"

const TokenRewardCard = () => {
  const { token, isTokenLoading, rewardImageUrl, rewardsByRoles } =
    useTokenRewardContext()

  const { getValue } = useCalculateClaimableTokens(rewardsByRoles)
  const claimableAmount = getValue()

  const platformToRemove = rewardsByRoles[0].rewards[0].guildPlatform

  return (
    <>
      <RewardCard
        label={rewards.ERC20.name}
        title={isTokenLoading ? null : `Claim ${claimableAmount} ${token.symbol}`}
        // TOOD: create ERC20 colorScheme
        colorScheme={"gold"}
        image={rewardImageUrl}
        cornerButton={
          <>
            <PlatformCardMenu>
              {/* TODO: Add remove option (or maybe only allow it in the role edit panel?) */}
              <RemovePlatformMenuItem
                platformGuildId={`${platformToRemove.platformGuildId}`}
              />
            </PlatformCardMenu>
          </>
        }
      >
        <TokenCardButton />
      </RewardCard>
    </>
  )
}

const TokenRewardCardWrapper = ({ reward }: { reward: TokenAccessHubData }) => (
  <TokenRewardProvider tokenReward={reward}>
    <TokenRewardCard />
  </TokenRewardProvider>
)

export { TokenRewardCardWrapper as TokenRewardCard }
