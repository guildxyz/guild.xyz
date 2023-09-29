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

  if (!url && !showFallback) return null

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
      {url ? (
        <Image src={url} alt="event cover" layout="fill" objectFit="cover" />
      ) : (
        <Center>
          <Icon as={GuildGhost} color={ghostColor} boxSize={12} />
        </Center>
      )}
    </AspectRatio>
  )
}

export default EventImage
