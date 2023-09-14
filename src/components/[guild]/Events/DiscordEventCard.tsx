import {
  Box,
  Button,
  Center,
  Collapse,
  HStack,
  Heading,
  IconButton,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Card from "components/common/Card"
import Link from "components/common/Link"
import { DiscordEvent } from "hooks/useDiscordEvent"
import Image from "next/image"
import { ArrowSquareOut, CaretDown, CaretUp, Clock, Users } from "phosphor-react"

type Props = {
  event: DiscordEvent
  guildId: number
}

const DiscordEventCard = ({
  event: { name, description, image, scheduledStartTimestamp, userCount, id },
  guildId,
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
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: false,
  })

  return (
    <Card mb={"5"} flexDirection={{ base: "column-reverse", md: "row" }}>
      <VStack alignItems={"flex-start"} flex={"1"} p={5} gap={4}>
        <Heading
          fontSize={"2xl"}
          fontFamily={"Dystopian"}
          fontWeight={"bold"}
          mb={-1}
        >
          {name}
        </Heading>
        <HStack gap={3} w="full">
          <Tag colorScheme="gray">
            <TagLeftIcon as={Clock} boxSize={3.5} />
            <TagLabel> {formatedDateTime}</TagLabel>
          </Tag>
          {userCount && (
            <Tag colorScheme="gray">
              <TagLeftIcon as={Users} boxSize={3.5} />
              <TagLabel> {userCount}</TagLabel>
            </Tag>
          )}
        </HStack>
        {description && (
          <Box position={"relative"}>
            <Collapse startingHeight={"40px"} in={isOpen}>
              <Text fontSize={"sm"} flexGrow={1}>
                {description}
              </Text>
            </Collapse>
            <IconButton
              aria-label="read-more-less"
              icon={isOpen ? <CaretUp /> : <CaretDown />}
              onClick={onToggle}
              variant={"solid"}
              size={"xs"}
              position={"absolute"}
              bottom={-7}
              left={"50%"}
              translateX={"-50%"}
            />
          </Box>
        )}
        <Link
          href={`https://discord.com/events/${guildId}/${id}`}
          isExternal
          colorScheme="gray"
          fontWeight="medium"
          mt={3}
          onClick={() => {
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
