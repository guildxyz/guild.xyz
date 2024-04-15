import { Schemas } from "@guildxyz/types"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import { TokenAccessHubData } from "components/[guild]/AccessHub/hooks/useAccessedTokens"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import RewardCard from "components/common/RewardCard"
import rewards from "platforms/rewards"
import TokenCardButton from "./TokenCardButton"
import { TokenRewardProvider, useTokenRewardContext } from "./TokenRewardContext"

// TODO: move to some more common file
export const calculateFromDynamicAmount = (
  dynamicAmount: Schemas["DynamicAmount"]
) => {
  const rewardType = dynamicAmount?.operation?.input?.[0]?.type

  switch (rewardType) {
    case "STATIC":
      return dynamicAmount.operation.input[0].value
    case "REQUIREMENT_AMOUNT":
      // TODO
      return 0
    case "REQUIREMENT_ACCESS":
      // TODO
      return 0
    default:
      return 0
  }
}

export const calculateClaimableForRole = (
  roleRewards: TokenAccessHubData["rewardsByRoles"][0]["rewards"]
) => {
  const sum = roleRewards.reduce((acc, reward) => {
    return acc + calculateFromDynamicAmount(reward.rolePlatform.dynamicAmount)
  }, 0)

  return sum
}

export const calculateClaimableAmount = (
  rewardsByRoles: TokenAccessHubData["rewardsByRoles"]
) => {
  const sum = rewardsByRoles.reduce((acc, rewardsByRole) => {
    return acc + calculateClaimableForRole(rewardsByRole.rewards)
  }, 0)

  return sum
}

const TokenRewardCard = () => {
  const { token, isTokenLoading, rewardImageUrl, rewardsByRoles } =
    useTokenRewardContext()
  const claimableAmount = calculateClaimableAmount(rewardsByRoles)

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
