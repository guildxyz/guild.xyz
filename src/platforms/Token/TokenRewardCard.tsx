import { Circle, Img, useColorModeValue } from "@chakra-ui/react"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import { TokenAccessHubData } from "components/[guild]/AccessHub/hooks/useAccessedTokens"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import RewardCard from "components/common/RewardCard"
import rewards from "platforms/rewards"
import TokenCardButton from "./TokenCardButton"
import { TokenRewardProvider, useTokenRewardContext } from "./TokenRewardContext"
import { useCalculateClaimableTokens } from "./hooks/useCalculateToken"

const TokenRewardCard = () => {
  const {
    token,
    isTokenLoading,
    tokenReward: { guildPlatform, rolePlatformsByRoles },
    rewardImageUrl,
  } = useTokenRewardContext()

  const { getValue } = useCalculateClaimableTokens(rolePlatformsByRoles)
  const claimableAmount = getValue()

  const bgColor = useColorModeValue("gray.700", "gray.600")

  return (
    <>
      <RewardCard
        label={rewards.ERC20.name}
        title={isTokenLoading ? null : `Claim ${claimableAmount} ${token.symbol}`}
        colorScheme={"gold"}
        image={
          rewardImageUrl.match("guildLogos") ? (
            <Circle size={10} bgColor={bgColor}>
              <Img src={rewardImageUrl} alt="Guild logo" boxSize="40%" />
            </Circle>
          ) : (
            rewardImageUrl
          )
        }
        cornerButton={
          <>
            <PlatformCardMenu>
              <RemovePlatformMenuItem
                platformGuildId={guildPlatform.platformGuildId}
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
