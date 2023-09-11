import { Icon, Spinner, Text, VStack, useColorModeValue } from "@chakra-ui/react"
import useServerData from "hooks/useServerData"
import { WarningOctagon } from "phosphor-react"
import { PlatformType } from "types"
import useGuild from "../hooks/useGuild"
import DiscordEventCard from "./components/DiscordEventCard"

type Props = {
  title?: string
}

const GuildEvents = ({}: Props): JSX.Element => {
  const { id: guildId, guildPlatforms } = useGuild()
  const cardBg = useColorModeValue("white", "gray.700")
  const textColor = useColorModeValue("gray.400", "whiteAlpha.500")
  const iconColor = useColorModeValue("gray.200", "whiteAlpha.300")

  const discordGuildPlatform = guildPlatforms?.find(
    (platform) => platform.platformId === PlatformType.DISCORD
  )

  const { data } = useServerData(discordGuildPlatform?.platformGuildId)
  const isLoading = false
  const isError = false

  const mock = [
    {
      id: "1148621661705347173",
      guildId: "string",
      name: "SmartCon 2023 by ChainLink -Where Web3 gets Real",
      description:
        "Join a wide range of curated experiences and learning sessions from leading Web3 teams.",
      scheduledStartTimestamp: "2023-09-26T08:00:30.996+0200",
      privacyLevel: 1,
      status: 2,
      entityType: 3,
      userCount: 23,
      image: "b4f65e0110732f8c5294350a19088308",
    },
  ]

  if (isLoading)
    return (
      <VStack
        bg={cardBg}
        borderRadius={"2xl"}
        mb={"10"}
        paddingY={14}
        justify={"center"}
      >
        <Spinner />
        <Text color={textColor} fontSize="sm">
          searching for events...
        </Text>
      </VStack>
    )

  if (isError)
    return (
      <VStack
        bg={cardBg}
        borderRadius={"2xl"}
        mb={"10"}
        paddingY={14}
        paddingX={4}
        justify={"center"}
      >
        <Icon as={WarningOctagon} bg={iconColor} rounded="full" h={8} w={8} p={2} />
        <Text color={textColor} fontSize="sm" align="center">
          Something went wrong during the loading of the events.
        </Text>
      </VStack>
    )

  /*if (!data.events?.length)
    return (
      <VStack bg={cardBg} borderRadius={"2xl"} mb={"10"} paddingY={14} paddingX={3}>
        <Icon as={NoteBlank} bg={iconColor} rounded="full" h={8} w={8} p={2} />
        <Text fontSize="xl">No events yet.</Text>
        <Text color={textColor}>
          Your guild has no upcoming event currently or you have no access to Discord
        </Text>
      </VStack>
    )*/

  return (
    <>
      {mock.map((event) => (
        <DiscordEventCard
          id={event.id}
          name={event.name}
          description={event.description}
          imageHash={event.image}
          startAt={event.scheduledStartTimestamp}
          userCount={event.userCount}
          guildId={guildId}
          key={event.id}
        />
      ))}
    </>
  )
}

export default GuildEvents
