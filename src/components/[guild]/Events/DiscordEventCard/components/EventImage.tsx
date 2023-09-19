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
  image: string
  eventId: string
  showFallback?: boolean
} & AspectRatioProps

const EventImage = ({
  image,
  showFallback = true,
  eventId,
  ...rest
}: Props): JSX.Element => {
  const bg = useColorModeValue("gray.200", "whiteAlpha.200")
  const ghostColor = useColorModeValue("white", "whiteAlpha.300")

  if (!image && !showFallback) return null

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
      {image ? (
        <Image
          src={`https://cdn.discordapp.com/guild-events/${eventId}/${image}.png?size=512`}
          alt="event cover"
          layout="fill"
          objectFit="cover"
        />
      ) : (
        <Center>
          <Icon as={GuildGhost} color={ghostColor} boxSize={12} />
        </Center>
      )}
    </AspectRatio>
  )
}

export default EventImage
