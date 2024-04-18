import { TokenAccessHubData } from "components/[guild]/AccessHub/hooks/useAccessedTokens"
import useTokenData from "hooks/useTokenData"
import { ReactElement, createContext, useContext } from "react"
import useTokenClaimFee from "./hooks/useClaimToken"

export type TokenRewardContextType = {
  tokenReward: TokenAccessHubData
  token: ReturnType<typeof useTokenData>["data"]
  isTokenLoading: boolean
  fee: bigint
  isFeeLoading: boolean
  rewardImageUrl: string
}

const TokenRewardProvider = ({
  children,
  tokenReward,
}: {
  children: ReactElement
  tokenReward: TokenAccessHubData
}): JSX.Element => {
  const { fee, isFeeLoading } = useTokenClaimFee(
    tokenReward?.guildPlatform?.platformGuildData?.chain,
    tokenReward?.rolePlatformsByRoles?.[0]?.roleId,
    tokenReward?.rolePlatformsByRoles?.[0]?.rolePlatforms?.[0]?.id
  )

  const { data: token, isLoading: isTokenLoading } = useTokenData(
    tokenReward?.guildPlatform?.platformGuildData?.chain,
    tokenReward?.guildPlatform?.platformGuildData?.tokenAddress
  )

  const rewardImageUrl =
    token.logoURI ??
    (tokenReward?.guildPlatform?.platformGuildData?.imageUrl ||
      `/guildLogos/132.svg`)

  return (
    <TokenRewardContext.Provider
      value={{
        tokenReward,
        token: { ...token },
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
