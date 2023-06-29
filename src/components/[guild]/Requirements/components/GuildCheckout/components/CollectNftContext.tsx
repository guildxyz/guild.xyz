import { BigNumber } from "@ethersproject/bignumber"
import { Chain, Chains } from "connectors"
import useBalance from "hooks/useBalance"
import { createContext, PropsWithChildren, useContext } from "react"

type Props = {
  roleId: number
  rolePlatformId: number
  chain: Chain
  address: string
  alreadyCollected: boolean
}

const CollectNftContext = createContext<Props>(undefined)

const CollectNftProvider = ({
  roleId,
  rolePlatformId,
  chain,
  address,
  children,
}: PropsWithChildren<Omit<Props, "alreadyCollected">>) => {
  const { tokenBalance: nftBalance } = useBalance(address, Chains[chain])
  const alreadyCollected = nftBalance?.gt(BigNumber.from(0))

  return (
    <CollectNftContext.Provider
      value={{ roleId, rolePlatformId, chain, address, alreadyCollected }}
    >
      {children}
    </CollectNftContext.Provider>
  )
}

const useCollectNftContext = () => useContext(CollectNftContext)

export { CollectNftProvider, useCollectNftContext }
