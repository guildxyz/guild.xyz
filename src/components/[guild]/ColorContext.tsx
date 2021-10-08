import { ColorModeContext } from "@chakra-ui/color-mode"
import { Box } from "@chakra-ui/layout"
import { noop } from "@chakra-ui/utils"
import useColorPalette from "hooks/useColorPalette"
import React, {
  createContext,
  Dispatch,
  forwardRef,
  PropsWithChildren,
  SetStateAction,
  useContext,
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

    return (
      <ColorContext.Provider
        value={{
          setThemeColor,
          themeMode,
          setThemeMode,
        }}
      >
        <ColorModeContext.Provider
          value={{
            colorMode: themeMode === "LIGHT" ? "light" : "dark",
            toggleColorMode: noop,
            setColorMode: noop,
          }}
        >
          <Box
            ref={ref}
            sx={{
              ...generatedColors,
              color:
                themeMode === "LIGHT" ? "var(--chakra-colors-gray-800)" : undefined,
            }}
          >
            {children}
          </Box>
        </ColorModeContext.Provider>
      </ColorContext.Provider>
    )
  }
)

const useColorContext = () => useContext(ColorContext)

export { useColorContext, ColorProvider }
