import { Circle, Img, ResponsiveValue, useColorMode } from "@chakra-ui/react"
import Image from "next/image"
import { memo } from "react"
import { Rest } from "types"

type Props = {
  imageUrl?: string
  size?: ResponsiveValue<number | string>
  priority?: boolean
} & Rest

const GuildLogo = memo(
  ({ imageUrl, size = "48px", priority = false, ...rest }: Props): JSX.Element => {
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
              alt="Guild logo"
              layout="fill"
              priority={priority}
            />
          ))}
      </Circle>
    )
  }
)

export default GuildLogo
