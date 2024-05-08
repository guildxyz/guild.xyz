import {
  TokenRewardProvider,
  useTokenRewardContext,
} from "platforms/Token/TokenRewardContext"
import { useWatch } from "react-hook-form"
import { GuildPlatform } from "types"
import RewardPreview from "./RewardPreview"

const TokenPreview = ({ children }): JSX.Element => {
  const { token, imageUrl } = useTokenRewardContext()

  return (
    <RewardPreview type="ERC20" name={`Claim ${token.data.symbol}`} image={imageUrl}>
      {children}
    </RewardPreview>
  )
}

const TokenPreviewWrapper = ({ children }): JSX.Element => {
  const guildPlatform: GuildPlatform = useWatch({
    name: "rolePlatforms.0.guildPlatform",
  })

  return (
    <TokenRewardProvider guildPlatform={guildPlatform}>
      <TokenPreview>{children}</TokenPreview>
    </TokenRewardProvider>
  )
}

export default TokenPreviewWrapper
