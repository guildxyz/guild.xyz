import { createContext, useEffect, useState, useContext } from "react"
import { Chains } from "connectors"
import { useWeb3React } from "@web3-react/core"
import type { Community } from "temporaryData/types"

type Props = {
  data: Community
  children: JSX.Element
}

const CommunityContext = createContext<Community | null>(null)

const CommunityProvider = ({ data, children }: Props): JSX.Element => {
  const { chainId } = useWeb3React()
  const [communityData, setCommunityData] = useState<Community>({
    ...data,
    chainData: data.chainData[Object.keys(data.chainData)[0]],
  })

  useEffect(() => {
    if (chainId) {
      setCommunityData({
        ...data,
        chainData: data.chainData[Chains[chainId]],
      })
    }
  }, [chainId, data])

  return (
    <CommunityContext.Provider value={communityData}>
      {children}
    </CommunityContext.Provider>
  )
}

const useCommunity = (): Community => useContext(CommunityContext)

export { useCommunity, CommunityProvider }
