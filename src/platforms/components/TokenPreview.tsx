import { useAccessedTokens } from "components/[guild]/AccessHub/hooks/useAccessedTokens"
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

  const accessedTokens = useAccessedTokens()
  const res = accessedTokens.find(
    (token) => token.guildPlatform.id === guildPlatform?.id
  )

  return (
    <TokenRewardProvider
      tokenReward={{
        guildPlatform: guildPlatform,
        rolePlatformsByRoles: res?.rolePlatformsByRoles || [],
      }}
    >
      <TokenPreview />
    </TokenRewardProvider>
  )
}

export default TokenPreviewWrapper
