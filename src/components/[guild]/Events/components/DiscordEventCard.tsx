import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react"
import Link from "components/common/Link"
import Image from "next/image"
import { ArrowSquareOut, Clock, Users } from "phosphor-react"

type Props = {
  name: string
  startAt: string
  description?: string
  imageHash?: string
  userCount?: number
  id: string
  guildId: number
}

const DiscordEventCard = ({
  name,
  description,
  imageHash,
  startAt,
  userCount,
  id,
  guildId,
}: Props): JSX.Element => {
  const LOCALE = "en-US"
  const TO_LOCALE_STRING_OPTIONS: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  const formatedDateTime = new Date(startAt).toLocaleDateString(
    LOCALE,
    TO_LOCALE_STRING_OPTIONS
  )
  const cardBg = useColorModeValue("white", "gray.700")
  const textColor = useColorModeValue("gray.500", "whiteAlpha.800")
  const tagBg = useColorModeValue("gray.200", "whiteAlpha.300")

  return (
    <Flex
      bg={cardBg}
      borderRadius={"2xl"}
      mb={"10"}
      shadow={"base"}
      direction={{ base: "column", md: "row" }}
    >
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
          <Tag bg={tagBg} color={textColor}>
            <TagLeftIcon as={Clock} boxSize={3.5} />
            <TagLabel> {formatedDateTime}</TagLabel>
          </Tag>
          {userCount && (
            <Tag bg={tagBg} color={textColor}>
              <TagLeftIcon as={Users} boxSize={3.5} />
              <TagLabel> {userCount}</TagLabel>
            </Tag>
          )}
        </HStack>
        {description && (
          <Text fontSize={"sm"} flexGrow={1}>
            {description}
          </Text>
        )}
        <Link
          href={`https://discord.com/events/${guildId}/${id}`}
          isExternal
          colorScheme="gray"
          fontWeight="medium"
        >
          <Button colorScheme="indigo" rightIcon={<ArrowSquareOut />} size="sm">
            Join Discord event
          </Button>
        </Link>
      </VStack>
      <Box flex={"1"} p={4}>
        <Box borderRadius={"2xl"} overflow="clip">
          <Image
            src={`https://cdn.discordapp.com/guild-events/${id}/${imageHash}.png`}
            alt="event cover"
            width={800}
            height={400}
          />
        </Box>
      </Box>
    </Flex>
  )
}

export default DiscordEventCard
