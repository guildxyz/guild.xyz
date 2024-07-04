import { useWatch } from "react-hook-form"
import {
  TokenRewardProvider,
  useTokenRewardContext,
} from "rewards/Token/TokenRewardContext"
import { GuildPlatform } from "types"
import RewardPreview from "./RewardPreview"
import { PropsWithChildren } from "react"

const TokenPreview = ({ children }: PropsWithChildren): JSX.Element => {
  const { token, imageUrl } = useTokenRewardContext()

  return (
    <RewardPreview type="ERC20" name={`Claim ${token.data.symbol}`} image={imageUrl}>
      {children}
    </RewardPreview>
  )
}

const TokenPreviewWrapper = ({ children }: PropsWithChildren): JSX.Element => {
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
