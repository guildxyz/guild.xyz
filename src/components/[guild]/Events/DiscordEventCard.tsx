import {
  Box,
  Button,
  Center,
  Collapse,
  HStack,
  Heading,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Card from "components/common/Card"
import Link from "components/common/Link"
import { DiscordEvent } from "hooks/useDiscordEvent"
import Image from "next/image"
import { ArrowSquareOut, Clock, Users } from "phosphor-react"

type Props = {
  event: DiscordEvent
  guildId: number
  showFullDescription?: boolean
  flexDirectionMd?: "row" | "column-reverse"
  cursorPointer?: boolean
}

const DiscordEventCard = ({
  event: { name, description, image, scheduledStartTimestamp, userCount, id },
  flexDirectionMd = "row",
  guildId,
  showFullDescription,
  cursorPointer,
}: Props): JSX.Element => {
  const LOCALE = "en-US"
  const TO_LOCALE_STRING_OPTIONS: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  const formatedDateTime = new Date(scheduledStartTimestamp).toLocaleDateString(
    LOCALE,
    TO_LOCALE_STRING_OPTIONS
  )
  const { captureEvent } = usePostHogContext()
  const textColor = useColorModeValue("gray.500", "whiteAlpha.800")
  const tagBg = useColorModeValue("gray.200", "whiteAlpha.300")

  return (
    <Card
      flexDirection={{ base: "column-reverse", md: flexDirectionMd }}
      cursor={cursorPointer ? "pointer" : "default"}
    >
      <VStack alignItems={"flex-start"} flex={"1"} p={5} gap={4}>
        <Heading
          fontSize={"xl"}
          fontFamily={"Dystopian"}
          fontWeight={"bold"}
          mb={-1}
        >
          {name}
        </Heading>
        <HStack gap={2} w="full">
          <Tag>
            <TagLeftIcon as={Clock} boxSize={3.5} />
            <TagLabel> {formatedDateTime}</TagLabel>
          </Tag>
          {userCount && (
            <Tag>
              <TagLeftIcon as={Users} boxSize={3.5} />
              <TagLabel> {userCount}</TagLabel>
            </Tag>
          )}
        </HStack>
        {description && (
          <Box>
            <Collapse startingHeight={"40px"} in={showFullDescription}>
              <Text fontSize={"sm"} flexGrow={1}>
                {description}
              </Text>
            </Collapse>
          </Box>
        )}
        <Link
          href={`https://discord.com/events/${guildId}/${id}`}
          isExternal
          colorScheme="gray"
          fontWeight="medium"
          mt={3}
          onClick={(event) => {
            event.stopPropagation()
            captureEvent("Click on join event button", {
              eventType: "Discord",
              eventName: name,
              userCount,
              guildId,
            })
          }}
        >
          <Button colorScheme="indigo" rightIcon={<ArrowSquareOut />} size="sm">
            Join Discord event
          </Button>
        </Link>
      </VStack>
      {image ? (
        <Box flex={"1"} p={4}>
          <Image
            src={`https://cdn.discordapp.com/guild-events/${id}/${image}.png?size=512`}
            alt="event cover"
            width={800}
            height={320}
            style={{ borderRadius: "1rem", overflow: "clip" }}
          />
        </Box>
      ) : (
        <Box flex={"1"} p={4} display={"flex"}>
          <Center bg={tagBg} flexGrow={1} borderRadius={"2xl"} color={textColor}>
            no cover image
          </Center>
        </Box>
      )}
    </Card>
  )
}

export default DiscordEventCard
