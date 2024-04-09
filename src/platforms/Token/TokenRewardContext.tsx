import { Chain } from "@guildxyz/types"
import { TokenAccessHubData } from "components/[guild]/AccessHub/hooks/useAccessedTokens"
import useTokenData from "hooks/useTokenData"
import { ReactElement, createContext, useContext } from "react"
import { GuildPlatform } from "types"

export type TokenRewardContextType = {
  chain: Chain
  token: ReturnType<typeof useTokenData>["data"]
  isTokenLoading: boolean
  fee: bigint
  isFeeLoading: boolean
  guildPlatforms: GuildPlatform[]
  rewardImageUrl: string
}

const TokenRewardProvider = ({
  children,
  tokenReward,
}: {
  children: ReactElement
  tokenReward: TokenAccessHubData
}): JSX.Element => {
  // TODO: remove mock data
  const fee = BigInt(0)
  const isFeeLoading = false

  const { data: token, isLoading: isTokenLoading } = useTokenData(
    tokenReward.chain,
    tokenReward.address
  )

  const rewardImageUrl =
    token.logoURI ??
    (tokenReward.guildPlatforms.find(
      (gp) =>
        !!gp.platformGuildData.imageUrl &&
        gp.platformGuildData.imageUrl !== `/guildLogos/132.svg`
    )?.platformGuildData?.imageUrl ||
      `/guildLogos/132.svg`)

  return (
    <TokenRewardContext.Provider
      value={{
        chain: tokenReward.chain,
        guildPlatforms: tokenReward.guildPlatforms,
        token,
        isFeeLoading,
        fee,
        isTokenLoading,
        rewardImageUrl,
      }}
    >
      {children}
    </TokenRewardContext.Provider>
  )
}

const TokenRewardContext = createContext<TokenRewardContextType>(undefined)
const useTokenRewardContext = () => useContext(TokenRewardContext)

export { TokenRewardProvider, useTokenRewardContext }
