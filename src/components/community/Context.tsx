import { createContext, useEffect, useState, useContext } from "react"
import { Chains } from "connectors"
import { useWeb3React } from "@web3-react/core"
import type { ProvidedCommunity, Community } from "temporaryData/types"
import { Box } from "@chakra-ui/react"
import useColorPalette from "./hooks/useColorPalette"

type Props = {
  data: Community
  children: JSX.Element
}

const CommunityContext = createContext<ProvidedCommunity | null>(null)

const CommunityProvider = ({ data, children }: Props): JSX.Element => {
  const { chainId } = useWeb3React()
  const [communityData, setCommunityData] = useState<ProvidedCommunity>({
    ...data,
    chainData: data.chainData[Object.keys(data.chainData)[0]],
  })
  const generatedColors = useColorPalette(
    "chakra-colors-primary",
    communityData.theme.color
  )

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
      <Box sx={generatedColors}>{children}</Box>
    </CommunityContext.Provider>
  )
}

const useCommunity = (): ProvidedCommunity => useContext(CommunityContext)

export { useCommunity, CommunityProvider }
