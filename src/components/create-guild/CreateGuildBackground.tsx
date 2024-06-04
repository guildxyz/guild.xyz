import { useThemeContext } from "components/[guild]/ThemeContext"
import { Layout } from "components/common/Layout"
import { useWatch } from "react-hook-form"

export function CreateGuildBackground() {
  const { localThemeColor, localBackgroundImage } = useThemeContext()
  const themeColor = useWatch({ name: "theme.color" })
  const color = localThemeColor !== themeColor ? themeColor : localThemeColor

  return (
    <Layout.Background
      backgroundOffset={47}
      background={color}
      backgroundImage={localBackgroundImage}
    />
  )
}
