import { Center, Img, useColorMode } from "@chakra-ui/react"
// eslint-disable-next-line import/no-extraneous-dependencies
import { ResponsiveObject } from "@chakra-ui/styled-system/dist/types/utils"
import { Rest } from "types"

type Props = {
  imageUrl: string
  size: number | ResponsiveObject<number>
  iconSize: number | ResponsiveObject<number>
} & Rest

const GuildLogo = ({ imageUrl, size, iconSize, ...rest }: Props) => {
  const { colorMode } = useColorMode()

  if (imageUrl.match("guildLogos"))
    return (
      <Center
        bgColor={colorMode === "light" ? "gray.700" : "gray.600"}
        boxSize={size}
        rounded="full"
        {...rest}
      >
        <Img src={imageUrl} boxSize={iconSize} />
      </Center>
    )
  return <Img src={imageUrl} boxSize={size} borderRadius="full" {...rest} />
}

export default GuildLogo
