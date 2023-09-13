import { Icon, Spinner, Text, VStack, useColorModeValue } from "@chakra-ui/react"
import DiscordEventCard from "components/[guild]/Events/components/DiscordEventCard"
import Tabs from "components/[guild]/Tabs"
import TabButton from "components/[guild]/Tabs/components/TabButton"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import PulseMarker from "components/common/PulseMarker"
import useDiscordEvents from "hooks/useDiscordEvent"
import useLocalStorage from "hooks/useLocalStorage"
import { NoteBlank, WarningOctagon } from "phosphor-react"
import { PlatformType } from "types"

const GuildEvents = (): JSX.Element => {
  const { id: guildId, name, imageUrl, urlName, guildPlatforms } = useGuild()
  const cardBg = useColorModeValue("white", "gray.700")
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()
  const [eventsSeen, setEventsSeen] = useLocalStorage<boolean>("eventsSeen", false)

  const cardTextColor = useColorModeValue("gray.400", "whiteAlpha.500")
  const iconColor = useColorModeValue("gray.200", "whiteAlpha.300")

  const discordGuildPlatform = guildPlatforms?.find(
    (platform) => platform.platformId === PlatformType.DISCORD
  )

  const { data, isLoading, isError } = useDiscordEvents(
    discordGuildPlatform?.platformGuildId
  )

  const LoadingState = (
    <VStack
      bg={cardBg}
      borderRadius={"2xl"}
      mb={"10"}
      paddingY={14}
      justify={"center"}
    >
      <Spinner />
      <Text color={cardTextColor} fontSize="sm">
        searching for events...
      </Text>
    </VStack>
  )

  const ErrorState = (
    <VStack
      bg={cardBg}
      borderRadius={"2xl"}
      mb={"10"}
      paddingY={14}
      paddingX={4}
      justify={"center"}
    >
      <Icon as={WarningOctagon} bg={iconColor} rounded="full" h={8} w={8} p={2} />
      <Text color={cardTextColor} fontSize="sm" align="center">
        Something went wrong during the loading of the events.
      </Text>
    </VStack>
  )

  const NoEventsState = (
    <VStack bg={cardBg} borderRadius={"2xl"} mb={"10"} paddingY={14} paddingX={3}>
      <Icon as={NoteBlank} bg={iconColor} rounded="full" h={8} w={8} p={2} />
      <Text fontSize="xl">No events yet.</Text>
      <Text color={cardTextColor}>
        Your guild has no upcoming event currently or you have no access to Discord
      </Text>
    </VStack>
  )

  return (
    <Layout
      title={name}
      ogTitle={`Activity${name ? ` - ${name}` : ""}`}
      image={
        <GuildLogo
          imageUrl={imageUrl}
          size={{ base: "56px", lg: "72px" }}
          mt={{ base: 1, lg: 2 }}
          bgColor={textColor === "primary.800" ? "primary.800" : "transparent"}
        />
      }
      imageUrl={imageUrl}
      textColor={textColor}
      background={localThemeColor}
      backgroundImage={localBackgroundImage}
    >
      <Tabs>
        <TabButton href={`/${urlName}`}>Home</TabButton>
        <PulseMarker placement="top" hidden={eventsSeen}>
          <TabButton
            href={`/${urlName}/events`}
            onClick={() => {
              setEventsSeen(true)
            }}
            isActive
          >
            Events
          </TabButton>
        </PulseMarker>
        <TabButton href={`/${urlName}/activity`}>Activity log</TabButton>
      </Tabs>
      {isLoading && LoadingState}
      {!isLoading && isError && ErrorState}
      {!isLoading && !isError && data.length === 0 && NoEventsState}
      {!isLoading &&
        !isError &&
        data.length > 0 &&
        data.map((event) => (
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
    </Layout>
  )
}

const GuildEventsWrapper = (): JSX.Element => (
  <ThemeProvider>
    <GuildEvents />
  </ThemeProvider>
)

export default GuildEventsWrapper
