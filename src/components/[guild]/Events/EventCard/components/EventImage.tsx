import {
  AspectRatio,
  AspectRatioProps,
  Center,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react"
import Image from "next/image"
import GuildGhost from "static/avatars/ghost.svg"

type Props = {
  url: string
  showFallback?: boolean
} & AspectRatioProps

const EventImage = ({ url, showFallback = true, ...rest }: Props): JSX.Element => {
  const bg = useColorModeValue("gray.200", "whiteAlpha.200")
  const ghostColor = useColorModeValue("white", "whiteAlpha.300")
  const allowedDomiansRegExp = [/img.evbuc.com/, /images.lumacdn.com/, /og.link3.to/]

  if (!url && !showFallback) return null

  if (url) {
    const isMatch = allowedDomiansRegExp.some((regExp) => regExp.test(url))

    return (
      <AspectRatio
        ratio={800 / 320}
        borderRadius="xl"
        overflow="hidden"
        bg={bg}
        position="relative"
        h="full"
        {...rest}
      >
        {isMatch ? (
          <Image src={url} alt="event cover" layout="fill" objectFit="cover" />
        ) : (
          <img src={url} alt="event cover" />
        )}
      </AspectRatio>
    )
  } else {
    return (
      <AspectRatio
        ratio={800 / 320}
        borderRadius="xl"
        overflow="hidden"
        bg={bg}
        position="relative"
        h="full"
        {...rest}
      >
        <Center>
          <Icon as={GuildGhost} color={ghostColor} boxSize={12} />
        </Center>
      </AspectRatio>
    )
  }
}

export default EventImage
