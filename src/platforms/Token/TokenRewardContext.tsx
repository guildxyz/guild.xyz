import { Chain } from "@guildxyz/types"
import { TokenAccessHubData } from "components/[guild]/AccessHub/hooks/useAccessedTokens"
import useTokenData from "hooks/useTokenData"
import { ReactElement, createContext, useContext } from "react"
import useClaimToken from "./hooks/useClaimToken"

export type TokenRewardContextType = {
  chain: Chain
  token: ReturnType<typeof useTokenData>["data"]
  isTokenLoading: boolean
  fee: bigint
  isFeeLoading: boolean
  rewardsByRoles: TokenAccessHubData["rewardsByRoles"]
  rewardImageUrl: string
}

const TokenRewardProvider = ({
  children,
  tokenReward,
}: {
  children: ReactElement
  tokenReward: TokenAccessHubData
}): JSX.Element => {
  const { fee, isFeeLoading } = useClaimToken(
    tokenReward.chain,
    tokenReward.rewardsByRoles[0].roleId,
    tokenReward.rewardsByRoles[0].rewards[0].rolePlatform.id
  )

  const { data: token, isLoading: isTokenLoading } = useTokenData(
    tokenReward.chain,
    tokenReward.address
  )

  // TODO: change this default image, it should be shown as an icon in a circle instead
  function findValidImageUrl(
    data: TokenAccessHubData["rewardsByRoles"]
  ): string | null {
    for (const item of data) {
      for (const reward of item.rewards) {
        const imageUrl = reward?.guildPlatform?.platformGuildData?.imageUrl
        if (imageUrl && imageUrl !== `/guildLogos/132.svg`) {
          return imageUrl
        }
      }
    }
    return null
  }

  const rewardImageUrl =
    token.logoURI ??
    (findValidImageUrl(tokenReward.rewardsByRoles) || `/guildLogos/132.svg`)

  return (
    <TokenRewardContext.Provider
      value={{
        chain: tokenReward.chain,
        rewardsByRoles: tokenReward.rewardsByRoles,
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
