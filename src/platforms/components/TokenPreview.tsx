import {
  TokenRewardProvider,
  useTokenRewardContext,
} from "platforms/Token/TokenRewardContext"
import { useWatch } from "react-hook-form"
import { GuildPlatform } from "types"
import RewardPreview from "./RewardPreview"

const TokenPreview = () => {
  const { token, rewardImageUrl } = useTokenRewardContext()

  return (
    <RewardPreview
      type="ERC20"
      name={`Claim ${token.symbol}`}
      image={rewardImageUrl}
    />
  )
}

const TokenPreviewWrapper = () => {
  const guildPlatform: GuildPlatform = useWatch({
    name: "rolePlatforms.0.guildPlatform",
  })

  return (
    <TokenRewardProvider
      tokenReward={{
        chain: guildPlatform.platformGuildData.chain,
        address: guildPlatform.platformGuildData.contractAddress,
        guildPlatforms: [guildPlatform],
      }}
    >
      <TokenPreview />
    </TokenRewardProvider>
  )
}

export default TokenPreviewWrapper
