import Image from "next/image"
import { useThemeContext } from "./ThemeContext"

const GuildPageBanner = () => {
  const { localThemeColor, localBackgroundImage } = useThemeContext()

  return localBackgroundImage ? (
    <Image
      src={localBackgroundImage}
      alt="Guild background image"
      priority
      fill
      sizes="100vw"
      style={{
        filter: "brightness(30%)",
        objectFit: "cover",
      }}
    />
  ) : (
    <div
      className="h-full w-full opacity-banner"
      style={{
        backgroundColor: localThemeColor,
      }}
    />
  )
}

export { GuildPageBanner }
