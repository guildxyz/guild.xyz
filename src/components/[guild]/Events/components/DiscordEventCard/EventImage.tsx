import {
  Box,
  Center,
  Img,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import Image from "next/image"

type Props = {
  image: string
  eventId: string
  showFallback?: boolean
}

const EventImage = ({ image, showFallback = true, eventId }: Props): JSX.Element => {
  const tagBg = useColorModeValue("gray.200", "whiteAlpha.200")
  const isMobile = useBreakpointValue({ base: true, md: false })

  if (image)
    return (
      <Box flex={1}>
        <Image
          src={`https://cdn.discordapp.com/guild-events/${eventId}/${image}.png?size=512`}
          alt="event cover"
          width={800}
          height={320}
          style={{ borderRadius: "var(--chakra-radii-xl)", overflow: "clip" }}
        />
      </Box>
    )

  if (isMobile) return null

  if (showFallback)
    return (
      <Center bg={tagBg} flexGrow={1} borderRadius={"2xl"}>
        <Img src="/guildLogos/46.svg" w="32px" mr="16px" opacity={0.5}></Img>
      </Center>
    )

  return null
}

export default EventImage
