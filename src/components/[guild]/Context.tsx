import { Portal } from "@chakra-ui/portal"
import React, { createContext, PropsWithChildren, useContext, useRef } from "react"
import { Group, Guild, Level, Platform } from "temporaryData/types"
import { ColorProvider } from "./ColorContext"

type GroupOrGuild = Group &
  Guild & {
    themeColor?: string
    themeMode?: string
    levels?: Array<Level>
    communityPlatforms?: Array<Platform>
  }

type Props = {
  data: GroupOrGuild | Group | Guild
}

const GuildContext = createContext<GroupOrGuild | null>(null)

const GuildProvider = ({
  data,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const colorPaletteProviderElementRef = useRef(null)

  return (
    <GuildContext.Provider
      value={{
        ...(data as GroupOrGuild),
      }}
    >
      <ColorProvider data={data as Guild} ref={colorPaletteProviderElementRef}>
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
