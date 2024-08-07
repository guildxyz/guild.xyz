import { useColorMode, useColorModeValue } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useColorPalette, { createColor } from "hooks/useColorPalette"
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

const ThemeContext = createContext<{
  localThemeColor: string
  setLocalThemeColor: Dispatch<SetStateAction<string>>
  localBackgroundImage: string
  setLocalBackgroundImage: Dispatch<SetStateAction<string>>
  textColor: string
  buttonColorScheme: string
  avatarBg: string
} | null>(null)

const ThemeProvider = memo(({ children }: PropsWithChildren<any>): JSX.Element => {
  const { theme } = useGuild()
  const { backgroundImage } = theme ?? {}
  const themeColorFallback = useColorModeValue("#27272a", "#18181b")
  const themeColor = theme?.color || themeColorFallback

  const [localThemeColor, setLocalThemeColor] = useState(themeColor)
  const [localBackgroundImage, setLocalBackgroundImage] = useState(backgroundImage)
  const generatedColors = useColorPalette("chakra-colors-primary", localThemeColor)
  const { colorMode } = useColorMode()

  // the initial value isn't enough, have to keep them in sync when they change due to SWR refetch
  useEffect(() => {
    setLocalThemeColor(themeColor)
  }, [themeColor])
  useEffect(() => {
    setLocalBackgroundImage(backgroundImage)
  }, [backgroundImage])

  const textColor = useMemo(() => {
    if (colorMode === "dark" || localBackgroundImage) return "whiteAlpha.900"
    const color = createColor(localThemeColor || "white")
    const saturation = color.hsl().array()[1]
    return color.luminosity() > 0.6 && saturation < 70
      ? "primary.800"
      : "whiteAlpha.900"
  }, [colorMode, localBackgroundImage, localThemeColor])

  const buttonColorScheme =
    textColor === "whiteAlpha.900" ? "whiteAlpha" : "blackAlpha"

  const bannerForegroundHSL = createColor(
    generatedColors["--chakra-colors-primary-800"]
  )
    .hsl()
    .array()
  const bannerOpacity = textColor === "primary.800" ? 1 : 0.5
  const avatarBg =
    textColor === "primary.800" ? "bg-banner-foreground" : "bg-transparent"

  return (
    <ThemeContext.Provider
      value={{
        localThemeColor,
        setLocalThemeColor,
        localBackgroundImage,
        setLocalBackgroundImage,
        textColor,
        buttonColorScheme,
        avatarBg,
      }}
    >
      <style>
        {`:root, [data-theme] {${Object.entries(generatedColors ?? {})
          .map(([key, value]) => `${key}: ${value};`)
          .join("")}
          ${textColor === "primary.800" ? `--banner-foreground:${bannerForegroundHSL[0].toFixed(2)} ${bannerForegroundHSL[1].toFixed(2)}% ${bannerForegroundHSL[2].toFixed(2)}%` : ""};--banner-opacity:${bannerOpacity};
          }`}
      </style>
      {children}
    </ThemeContext.Provider>
  )
})

const useThemeContext = () => useContext(ThemeContext)

export { ThemeProvider, useThemeContext }
