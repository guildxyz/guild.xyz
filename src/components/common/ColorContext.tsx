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
import { Group, Guild } from "temporaryData/types"

type Props = {
  data: Guild | Group
}

const isGuild = (obj: any): obj is Guild =>
  obj ? Object.keys(obj).includes("requirements") : false

const ColorContext = createContext<{
  setThemeColor: Dispatch<SetStateAction<string>>
  setThemeMode: Dispatch<SetStateAction<string>>
  themeMode: "LIGHT" | "DARK"
} | null>(null)

const ColorProvider = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  ({ data, children }, ref): JSX.Element => {
    const [themeColor, setThemeColor] = useState(
      (isGuild(data) ? data?.themeColor : data?.theme?.[0]?.color) || "#000000"
    )
    const [themeMode, setThemeMode] = useState(
      (isGuild(data) ? data?.themeMode : data?.theme?.[0]?.mode) || "DARK"
    )
    const generatedColors = useColorPalette("chakra-colors-primary", themeColor)
    const { setColorMode } = useColorMode()

    useEffect(() => {
      if (themeMode) setColorMode(themeMode.toLowerCase())

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
