import { Portal } from "@chakra-ui/portal"
import React, { createContext, PropsWithChildren, useContext, useRef } from "react"
import { Group, Guild } from "temporaryData/types"
import { ColorProvider } from "./ColorContext"

type Props = {
  data: {
    group?: Group
    guild?: Guild
  }
}

const GuildContext = createContext<{
  group?: Group | null
  guild?: Guild | null
} | null>(null)

const GuildProvider = ({
  data,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const colorPaletteProviderElementRef = useRef(null)

  return (
    <GuildContext.Provider
      value={{
        ...data,
      }}
    >
      <ColorProvider data={data.guild} ref={colorPaletteProviderElementRef}>
        {/* using Portal with it's parent's ref so it mounts children as they would normally be,
            but ensures that modals, popovers, etc are mounted inside instead at the end of the
            body so they'll use the provided css variables */}
        {typeof window === "undefined" ? (
          children
        ) : (
          <Portal containerRef={colorPaletteProviderElementRef}>{children}</Portal>
        )}
      </ColorProvider>
    </GuildContext.Provider>
  )
}

const useGuild = () => useContext(GuildContext)

export { useGuild, GuildProvider }
