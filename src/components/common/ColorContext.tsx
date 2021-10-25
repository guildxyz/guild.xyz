import { useColorMode } from "@chakra-ui/color-mode"
import { Box } from "@chakra-ui/layout"
import Color from "color"
import useColorPalette from "hooks/useColorPalette"
import React, {
  createContext,
  Dispatch,
  forwardRef,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { ThemeMode } from "temporaryData/types"

type Props = {
  themeColor: string
  themeMode?: ThemeMode
}

const ColorContext = createContext<{
  localThemeColor: string
  setLocalThemeColor: Dispatch<SetStateAction<string>>
  localThemeMode: ThemeMode
  setLocalThemeMode: Dispatch<SetStateAction<ThemeMode>>
  textColor: string
} | null>(null)

const ColorProvider = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  ({ themeColor = "#000000", themeMode = "DARK", children }, ref): JSX.Element => {
    const [localThemeColor, setLocalThemeColor] = useState(themeColor)
    const [localThemeMode, setLocalThemeMode] = useState(themeMode)
    const generatedColors = useColorPalette("chakra-colors-primary", localThemeColor)
    const { setColorMode } = useColorMode()

    // the initial value isn't enough, have to keep them in sync when they change due to SWR refetch
    useEffect(() => {
      if (themeColor) setLocalThemeColor(themeColor)
    }, [themeColor])
    useEffect(() => {
      if (themeMode === "LIGHT") setLocalThemeMode(themeMode)
    }, [themeMode])

    useEffect(() => {
      if (localThemeMode === "LIGHT") setColorMode(localThemeMode.toLowerCase())
    }, [localThemeMode])

    const textColor = useMemo(() => {
      const color = Color(localThemeColor)
      return color.isLight() ? "primary.800" : "white"
    }, [localThemeColor])

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
          {children}
        </Box>
      </ColorContext.Provider>
    )
  }
)

const useColorContext = () => useContext(ColorContext)

export { useColorContext, ColorProvider }
