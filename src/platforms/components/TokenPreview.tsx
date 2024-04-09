import {
  TokenRewardProvider,
  useTokenRewardContext,
} from "platforms/Token/TokenRewardContext"
import { useWatch } from "react-hook-form"
import RewardPreview from "./RewardPreview"

const TokenPreview = () => {
  const { token, platformGuildData } = useTokenRewardContext()

  return (
    <RewardPreview
      type="ERC20"
      name={`Claim ${token.symbol}`}
      image={token.logoURI || platformGuildData.imageUrl}
    />
  )
}

const TokenPreviewWrapper = () => {
  const guildPlatform = useWatch({
    name: "rolePlatforms.0.guildPlatform",
  })

  return (
    <TokenRewardProvider guildPlatform={guildPlatform}>
      <TokenPreview />
    </TokenRewardProvider>
  )
}

export default TokenPreviewWrapper
