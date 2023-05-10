import { useColorMode } from "@chakra-ui/react"
import Color from "color"
import useGuild from "components/[guild]/hooks/useGuild"
import useColorPalette from "hooks/useColorPalette"
import {
  createContext,
  Dispatch,
  memo,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { ThemeMode } from "types"

const ThemeContext = createContext<{
  localThemeColor: string
  setLocalThemeColor: Dispatch<SetStateAction<string>>
  localThemeMode: ThemeMode
  setLocalThemeMode: Dispatch<SetStateAction<ThemeMode>>
  localBackgroundImage: string
  setLocalBackgroundImage: Dispatch<SetStateAction<string>>
  textColor: string
} | null>(null)

const ThemeProvider = memo(({ children }: PropsWithChildren<any>): JSX.Element => {
  const { theme } = useGuild()
  const { mode: themeMode, backgroundImage } = theme ?? {}
  const themeColor = theme?.color || (themeMode === "LIGHT" ? "#27272a" : "#18181b")

  const [localThemeColor, setLocalThemeColor] = useState(themeColor)
  const [localThemeMode, setLocalThemeMode] = useState(themeMode)
  const [localBackgroundImage, setLocalBackgroundImage] = useState(backgroundImage)
  const generatedColors = useColorPalette("chakra-colors-primary", localThemeColor)
  const { setColorMode } = useColorMode()

  // the initial value isn't enough, have to keep them in sync when they change due to SWR refetch
  useEffect(() => {
    if (themeColor) setLocalThemeColor(themeColor)
  }, [themeColor])
  useEffect(() => {
    if (themeMode) setLocalThemeMode(themeMode)
  }, [themeMode])
  useEffect(() => {
    if (backgroundImage) setLocalBackgroundImage(backgroundImage)
  }, [backgroundImage])

  useEffect(() => {
    if (localThemeMode) setColorMode(localThemeMode.toLowerCase())
  }, [localThemeMode])

  const textColor = useMemo(() => {
    if (localThemeMode === "DARK" || localBackgroundImage) return "whiteAlpha.900"
    const color = Color(localThemeColor || "white")
    return color.luminosity() > 0.5 ? "primary.800" : "whiteAlpha.900"
  }, [localThemeMode, localThemeColor])

  return (
    <ThemeContext.Provider
      value={{
        localThemeColor,
        setLocalThemeColor,
        localThemeMode,
        setLocalThemeMode,
        localBackgroundImage,
        setLocalBackgroundImage,
        textColor,
      }}
    >
      <style>
        {`:root {${Object.entries(generatedColors ?? {})
          .map(([key, value]) => `${key}: ${value};`)
          .join("")}}`}
      </style>
      {children}
    </ThemeContext.Provider>
  )
})

const useThemeContext = () => useContext(ThemeContext)

export { useThemeContext, ThemeProvider }
