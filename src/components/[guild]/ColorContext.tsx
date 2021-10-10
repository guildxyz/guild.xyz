import { useColorMode } from "@chakra-ui/color-mode"
import { Box } from "@chakra-ui/layout"
import useColorPalette from "hooks/useColorPalette"
import React, {
  createContext,
  Dispatch,
  forwardRef,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react"
import { Guild } from "temporaryData/types"

type Props = {
  data: Guild
}

const ColorContext = createContext<{
  setThemeColor: Dispatch<SetStateAction<string>>
  setThemeMode: Dispatch<SetStateAction<string>>
  themeMode: "LIGHT" | "DARK"
} | null>(null)

const ColorProvider = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  ({ data, children }, ref): JSX.Element => {
    // localColor will change when the user picks a new color in the ColorPicker
    const [themeColor, setThemeColor] = useState(data.themeColor || "#000000")
    const [themeMode, setThemeMode] = useState(data.themeMode || "DARK")
    const generatedColors = useColorPalette("chakra-colors-primary", themeColor)
    const { setColorMode } = useColorMode()

    useEffect(() => {
      setColorMode(themeMode.toLowerCase())

      return () => setColorMode("dark")
    }, [themeMode])

    return (
      <ColorContext.Provider
        value={{
          setThemeColor,
          themeMode,
          setThemeMode,
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
