import { Box, Portal } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { Chains } from "connectors"
import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import type { Community, ProvidedCommunity } from "temporaryData/types"
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
  const colorPaletteProviderElementRef = useRef(null)

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
      <Box ref={colorPaletteProviderElementRef} sx={generatedColors}>
        {/* using Portal with it's parent's ref so it mounts children as they would normally be,
            but ensures that modals, popovers, etc are mounted inside instead at the end of the
            body so they'll use the provided css variables */}
        <Portal containerRef={colorPaletteProviderElementRef}>{children}</Portal>
      </Box>
    </CommunityContext.Provider>
  )
}

const useCommunity = (): ProvidedCommunity => useContext(CommunityContext)

export { useCommunity, CommunityProvider }
