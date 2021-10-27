import { Portal } from "@chakra-ui/react"
import { ColorProvider } from "components/common/ColorContext"
import React, { createContext, PropsWithChildren, useContext, useRef } from "react"
import { Group } from "temporaryData/types"

type Props = {
  data: Group
}

const GroupContext = createContext<Group | null>(null)

const GroupProvider = ({
  data,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const colorPaletteProviderElementRef = useRef(null)

  return (
    <GroupContext.Provider
      value={{
        ...data,
      }}
    >
      <ColorProvider
        themeColor={data.theme?.[0]?.color}
        themeMode={data.theme?.[0]?.mode}
        ref={colorPaletteProviderElementRef}
      >
        {/* using Portal with it's parent's ref so it mounts children as they would normally be,
            but ensures that modals, popovers, etc are mounted inside instead at the end of the
            body so they'll use the provided css variables */}
        {typeof window === "undefined" ? (
          children
        ) : (
          <Portal containerRef={colorPaletteProviderElementRef}>{children}</Portal>
        )}
      </ColorProvider>
    </GroupContext.Provider>
  )
}

const useGroup = () => useContext(GroupContext)

export { useGroup, GroupProvider }
