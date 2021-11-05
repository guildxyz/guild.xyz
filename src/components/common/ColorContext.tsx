import { Box, Portal, useColorMode } from "@chakra-ui/react"
import Color from "color"
import useHall from "components/[hall]/hooks/useHall"
import useColorPalette from "hooks/useColorPalette"
import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { ThemeMode } from "temporaryData/types"

const ColorContext = createContext<{
  localThemeColor: string
  setLocalThemeColor: Dispatch<SetStateAction<string>>
  localThemeMode: ThemeMode
  setLocalThemeMode: Dispatch<SetStateAction<ThemeMode>>
  textColor: string
} | null>(null)

const ColorProvider = ({ children }: PropsWithChildren<any>): JSX.Element => {
  const { theme } = useHall()
  const { color: themeColor, mode: themeMode } = theme?.[0] ?? {}
  const [localThemeColor, setLocalThemeColor] = useState(themeColor)
  const [localThemeMode, setLocalThemeMode] = useState(themeMode)
  const generatedColors = useColorPalette("chakra-colors-primary", localThemeColor)
  const { setColorMode } = useColorMode()
  const ref = useRef(null)

  // the initial value isn't enough, have to keep them in sync when they change due to SWR refetch
  useEffect(() => {
    if (themeColor) setLocalThemeColor(themeColor)
  }, [themeColor])
  useEffect(() => {
    if (themeMode) setLocalThemeMode(themeMode)
  }, [themeMode])

  useEffect(() => {
    if (localThemeMode) setColorMode(localThemeMode.toLowerCase())
  }, [localThemeMode])

  const textColor = useMemo(() => {
    if (localThemeMode === "DARK") return "white"
    const color = Color(localThemeColor)
    return color.luminosity() > 0.5 ? "primary.800" : "whiteAlpha.900"
    // return color.isLight() ? "gray.800" : "whiteAlpha.900"
  }, [localThemeMode, localThemeColor])

  return (
    <ColorContext.Provider
      value={{
        localThemeColor,
        setLocalThemeColor,
        localThemeMode,
        setLocalThemeMode,
        textColor,
      }}
    >
      <Box ref={ref} sx={generatedColors}>
        {/* using Portal with it's parent's ref so it mounts children as they would normally be,
          but ensures that modals, popovers, etc are mounted inside instead at the end of the
          body so they'll use the provided css variables */}
        {typeof window === "undefined" ? (
          children
        ) : (
          <Portal containerRef={ref}>{children}</Portal>
        )}
      </Box>
    </ColorContext.Provider>
  )
}

const useColorContext = () => useContext(ColorContext)

export { useColorContext, ColorProvider }
