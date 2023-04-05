import { Circle, Img, ResponsiveValue, useColorMode } from "@chakra-ui/react"
import Image from "next/image"
import { memo } from "react"
import { Rest } from "types"

type Props = {
  imageUrl?: string
  imageQuality?: number
  size?: ResponsiveValue<number | string>
  priority?: boolean
} & Rest

const GuildLogo = memo(
  ({
    imageUrl,
    imageQuality = 70,
    size = "48px",
    priority = false,
    ...rest
  }: Props): JSX.Element => {
    const { colorMode } = useColorMode()

    return (
      <Circle
        position="relative"
        bgColor={colorMode === "light" ? "gray.700" : "gray.600"}
        size={size}
        overflow="hidden"
        {...rest}
      >
        {imageUrl &&
          (imageUrl?.match("guildLogos") ? (
            <Img src={imageUrl} alt="Guild logo" boxSize="40%" />
          ) : (
            <Image
              src={imageUrl}
              quality={imageQuality}
              alt="Guild logo"
              layout="fill"
              objectFit="cover"
              priority={priority}
            />
          ))}
      </Circle>
    )
  }
)

export default GuildLogo
