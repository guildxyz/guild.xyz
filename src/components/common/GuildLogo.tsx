import { Circle, useColorMode } from "@chakra-ui/react"
import Image from "next/image"
import { Rest } from "types"

type Props = {
  imageUrl?: string
  size?: number // in px, without unit
  iconSize?: number // in px, without unit
  priority?: boolean
} & Rest

const GuildLogo = ({
  imageUrl,
  size = 48,
  iconSize = 16,
  priority = false,
  ...rest
}: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Circle
      position="relative"
      bgColor={colorMode === "light" ? "gray.700" : "gray.600"}
      size={`${size}px`}
      overflow="hidden"
      {...rest}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Guild logo"
          width={imageUrl?.match("guildLogos") ? iconSize : size}
          height={imageUrl?.match("guildLogos") ? iconSize : size}
          priority={priority}
        />
      )}
    </Circle>
  )
}

export default GuildLogo
