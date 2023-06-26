import { Chain } from "connectors"
import { createContext, PropsWithChildren, useContext } from "react"

type Props = {
  chain: Chain
  address: string
}

const CollectNftContext = createContext<Props>(undefined)

const CollectNftProvider = ({
  chain,
  address,
  children,
}: PropsWithChildren<Props>) => (
  <CollectNftContext.Provider value={{ chain, address }}>
    {children}
  </CollectNftContext.Provider>
)

const useCollectNftContext = () => useContext(CollectNftContext)

export { CollectNftProvider, useCollectNftContext }
