import { useThemeContext } from "components/[guild]/ThemeContext"
import GuildLogo from "components/common/GuildLogo"
import { Layout } from "components/common/Layout"
import { useWatch } from "react-hook-form"

export function CreateGuildHeadline() {
  const name = useWatch({ name: "name" })
  const { textColor } = useThemeContext()
  const imageUrl = useWatch({ name: "imageUrl" })

  return (
    <Layout.Headline
      shortcutImageUrl={imageUrl}
      ogTitle={name || "Create Guild"}
      title={name || "Create Guild"}
      image={
        imageUrl && (
          <GuildLogo
            imageUrl={imageUrl}
            size={{ base: "56px", lg: "72px" }}
            mt={{ base: 1, lg: 2 }}
            bgColor={textColor === "primary.800" ? "primary.800" : "transparent"}
          />
        )
      }
    />
  )
}
