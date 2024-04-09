import useGuild from "components/[guild]/hooks/useGuild"
import useTokenData from "hooks/useTokenData"
import { ReactElement, createContext, useContext } from "react"
import { GuildPlatform, PlatformGuildData, RolePlatform } from "types"
import useClaimToken from "./hooks/useClaimToken"

export type TokenRewardContextType = {
  token: ReturnType<typeof useTokenData>["data"]
  tokenIsLoading
  rolePlatform: RolePlatform
  fee: bigint
  feeIsLoading: boolean
  platformGuildData: PlatformGuildData[keyof PlatformGuildData]
}

const TokenRewardProvider = ({
  children,
  guildPlatform,
}: {
  children: ReactElement
  guildPlatform: GuildPlatform
}): JSX.Element => {
  const { roles } = useGuild()
  const rolePlatform = roles
    ?.find((r) =>
      r.rolePlatforms.some((rp) => rp.guildPlatformId === guildPlatform.id)
    )
    ?.rolePlatforms?.find((rp) => rp.guildPlatformId === guildPlatform?.id)

  const { fee, feeLoading: feeIsLoading } = useClaimToken(guildPlatform)
  const {
    platformGuildData: { chain, contractAddress: tokenAddress },
  } = guildPlatform
  const { data: token, isLoading: tokenIsLoading } = useTokenData(
    chain,
    tokenAddress
  )

  return (
    <TokenRewardContext.Provider
      value={{
        platformGuildData: guildPlatform.platformGuildData,
        fee,
        feeIsLoading,
        token,
        tokenIsLoading,
        rolePlatform,
      }}
    >
      {children}
    </TokenRewardContext.Provider>
  )
}

const TokenRewardContext = createContext<TokenRewardContextType>(undefined)
const useTokenRewardContext = () => useContext(TokenRewardContext)

export { TokenRewardProvider, useTokenRewardContext }
