import { Circle, Img, useColorMode } from "@chakra-ui/react"
// eslint-disable-next-line import/no-extraneous-dependencies
import { ResponsiveObject } from "@chakra-ui/styled-system/dist/types/utils"
import { Rest } from "types"

type Props = {
  imageUrl: string
  size?: number | ResponsiveObject<number> | string
  iconSize?: number | ResponsiveObject<number>
} & Rest

const GuildLogo = ({
  imageUrl,
  size = "full",
  iconSize = undefined,
  ...rest
}: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Circle
      bgColor={colorMode === "light" ? "gray.700" : "gray.600"}
      size={size}
      overflow="hidden"
      {...rest}
    >
      {imageUrl?.match("guildLogos") ? (
        <Img src={imageUrl} boxSize={iconSize} />
      ) : (
        <Img src={imageUrl} minH="full" minW="full" objectFit="cover" />
      )}
    </Circle>
  )
}

export default GuildLogo
