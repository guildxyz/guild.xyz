import { Chain } from "connectors"
import { createContext, PropsWithChildren, useContext } from "react"

type Props = {
  roleId: number
  rolePlatformId: number
  chain: Chain
  address: string
}

const CollectNftContext = createContext<Props>(undefined)

const CollectNftProvider = ({
  roleId,
  rolePlatformId,
  chain,
  address,
  children,
}: PropsWithChildren<Props>) => (
  <CollectNftContext.Provider value={{ roleId, rolePlatformId, chain, address }}>
    {children}
  </CollectNftContext.Provider>
)

const useCollectNftContext = () => useContext(CollectNftContext)

export { CollectNftProvider, useCollectNftContext }
