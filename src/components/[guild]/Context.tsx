import { Box, Portal } from "@chakra-ui/react"
import React, { createContext, PropsWithChildren, useContext, useRef } from "react"
import { Guild } from "temporaryData/types"
import useColorPalette from "./hooks/useColorPalette"

type Props = {
  data: Guild
}

const GuildContext = createContext<Guild | null>(null)

const GuildProvider = ({
  data,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const generatedColors = useColorPalette(
    "chakra-colors-primary",
    data.themeColor !== "#000000" ? data.themeColor : "#6366F1"
  ) // Fallback to indigo
  const colorPaletteProviderElementRef = useRef(null)

  return (
    <GuildContext.Provider
      value={{
        ...data,
      }}
    >
      <Box ref={colorPaletteProviderElementRef} sx={generatedColors}>
        {/* using Portal with it's parent's ref so it mounts children as they would normally be,
            but ensures that modals, popovers, etc are mounted inside instead at the end of the
            body so they'll use the provided css variables */}
        {typeof window === "undefined" ? (
          children
        ) : (
          <Portal containerRef={colorPaletteProviderElementRef}>{children}</Portal>
        )}
      </Box>
    </GuildContext.Provider>
  )
}

const useGuild = (): Guild => useContext(GuildContext)

export { useGuild, GuildProvider }
