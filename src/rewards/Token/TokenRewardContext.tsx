import useTokenData from "hooks/useTokenData"
import { PropsWithChildren, createContext, useContext } from "react"
import { GuildPlatform } from "types"
import useTokenClaimFee from "./hooks/useClaimToken"

export type TokenRewardContextType = {
  guildPlatform: GuildPlatform
  token: { data: ReturnType<typeof useTokenData>["data"]; isLoading: boolean }
  fee: { amount: bigint; isLoading: boolean }
  imageUrl: string
}

const TokenRewardProvider = ({
  children,
  guildPlatform,
}: PropsWithChildren<{
  guildPlatform: GuildPlatform
}>): JSX.Element => {
  const {
    platformGuildData: { tokenAddress, chain, imageUrl },
  } = guildPlatform || { platformGuildData: {} }
  const { amount, isLoading: isFeeLoading } = useTokenClaimFee(chain)
  const { data: token, isLoading: isTokenLoading } = useTokenData(
    chain,
    tokenAddress
  )
  const rewardImageUrl = token.logoURI ?? (imageUrl || `/guildLogos/132.svg`)

  return (
    <TokenRewardContext.Provider
      value={{
        guildPlatform,
        token: { data: token, isLoading: isTokenLoading },
        fee: { amount, isLoading: isFeeLoading },
        imageUrl: rewardImageUrl,
      }}
    >
      {children}
    </TokenRewardContext.Provider>
  )
}

const TokenRewardContext = createContext<TokenRewardContextType>(undefined)
const useTokenRewardContext = () => useContext(TokenRewardContext)

export { TokenRewardProvider, useTokenRewardContext }
