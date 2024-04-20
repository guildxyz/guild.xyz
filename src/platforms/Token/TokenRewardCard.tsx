import { Circle, Img, useColorModeValue } from "@chakra-ui/react"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import RewardCard from "components/common/RewardCard"
import rewards from "platforms/rewards"
import { GuildPlatform } from "types"
import TokenCardButton from "./TokenCardButton"
import { TokenRewardProvider, useTokenRewardContext } from "./TokenRewardContext"
import { useCalculateClaimableTokens } from "./hooks/useCalculateToken"

const TokenRewardCard = () => {
  const { token, guildPlatform, imageUrl } = useTokenRewardContext()

  const { getValue } = useCalculateClaimableTokens(guildPlatform)
  const claimableAmount = getValue()

  const bgColor = useColorModeValue("gray.700", "gray.600")

  return (
    <>
      <RewardCard
        label={rewards.ERC20.name}
        title={
          token.isLoading ? null : `Claim ${claimableAmount} ${token.data.symbol}`
        }
        colorScheme={"gold"}
        image={
          imageUrl.match("guildLogos") ? (
            <Circle size={10} bgColor={bgColor}>
              <Img src={imageUrl} alt="Guild logo" boxSize="40%" />
            </Circle>
          ) : (
            imageUrl
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

const TokenRewardCardWrapper = ({ platform }: { platform: GuildPlatform }) => (
  <TokenRewardProvider guildPlatform={platform}>
    <TokenRewardCard />
  </TokenRewardProvider>
)

export { TokenRewardCardWrapper as TokenRewardCard }
