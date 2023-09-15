import { Box, Center, Img, useColorModeValue } from "@chakra-ui/react"
import Image from "next/image"

type Props = {
  image: string
  eventId: string
  showFallback?: boolean
}

const EventImage = ({ image, showFallback = true, eventId }: Props): JSX.Element => {
  const tagBg = useColorModeValue("gray.200", "whiteAlpha.200")

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

  if (showFallback)
    return (
      <Center
        bg={tagBg}
        flexGrow={1}
        borderRadius={"2xl"}
        display={{ base: "none", md: "flex" }}
      >
        <Img src="/guildLogos/46.svg" w={8} mr={4} opacity={0.5}></Img>
      </Center>
    )

  return null
}

export default EventImage
