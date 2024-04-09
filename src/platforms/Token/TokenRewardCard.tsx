import { TokenAccessHubData } from "components/[guild]/AccessHub/hooks/useAccessedTokens"
import RewardCard from "components/common/RewardCard"
import rewards from "platforms/rewards"
import TokenCardButton from "./TokenCardButton"
import { TokenRewardProvider, useTokenRewardContext } from "./TokenRewardContext"

const TokenRewardCard = () => {
  const { token, isTokenLoading, rewardImageUrl } = useTokenRewardContext()

  return (
    <>
      <RewardCard
        label={rewards.ERC20.name}
        title={isTokenLoading ? null : `Claim ${token.symbol}`}
        // TOOD: create ERC20 colorScheme
        colorScheme={"primary"}
        image={rewardImageUrl}
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
