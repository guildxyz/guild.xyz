import { Chain, Chains } from "connectors"
import { PropsWithChildren, createContext, useContext } from "react"
import { GuildPlatform } from "types"
import { useAccount, useBalance } from "wagmi"

type Props = {
  roleId: number
  rolePlatformId: number
  guildPlatform: GuildPlatform
  chain: Chain
  nftAddress: `0x${string}`
  alreadyCollected: boolean
}

const CollectNftContext = createContext<Props>(undefined)

const CollectNftProvider = ({
  roleId,
  rolePlatformId,
  guildPlatform,
  chain,
  nftAddress,
  children,
}: PropsWithChildren<Omit<Props, "alreadyCollected">>) => {
  // TODO: use `hasTheUserIdClaimed` instead of `balanceOf`, so it shows `Already claimed` for other addresses of the user too
  const { address } = useAccount()
  const { data } = useBalance({
    address,
    token: nftAddress,
    chainId: Chains[chain],
  })
  const alreadyCollected = data?.value > 0

  return (
    <CollectNftContext.Provider
      value={{
        roleId,
        rolePlatformId,
        guildPlatform,
        chain,
        nftAddress,
        alreadyCollected,
      }}
    >
      {children}
    </CollectNftContext.Provider>
  )
}

const useCollectNftContext = () => useContext(CollectNftContext)

export { CollectNftProvider, useCollectNftContext }
