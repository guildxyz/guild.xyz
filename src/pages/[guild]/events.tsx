import { Icon, Spinner, Text, VStack } from "@chakra-ui/react"
import DiscordEventCard from "components/[guild]/Events/DiscordEventCard"
import EventCard from "components/[guild]/Events/EventCard"
import Tabs from "components/[guild]/Tabs"
import TabButton from "components/[guild]/Tabs/components/TabButton"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import PulseMarker from "components/common/PulseMarker"
import useDiscordEvents from "hooks/useDiscordEvent"
import useLocalStorage from "hooks/useLocalStorage"
import { NoteBlank, WarningOctagon } from "phosphor-react"
import { PropsWithChildren } from "react"
import { PlatformType } from "types"

const FallBackFrame = (props: PropsWithChildren) => (
  <Card mb={"10"} paddingY={14} alignItems={"center"}>
    {props.children}
  </Card>
)

const GuildEvents = (): JSX.Element => {
  const { id: guildId, name, imageUrl, urlName, guildPlatforms } = useGuild()
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()
  const [eventsSeen, setEventsSeen] = useLocalStorage<boolean>("eventsSeen", false)
  const { isAdmin } = useGuildPermission()

  const discordGuildPlatform = guildPlatforms?.find(
    (platform) => platform.platformId === PlatformType.DISCORD
  )

  const { data, isLoading, isError } = useDiscordEvents(
    discordGuildPlatform?.platformGuildId
  )

  const LoadingState = (
    <FallBackFrame>
      <Spinner />
      <Text colorScheme="gray" fontSize="sm" mt={1}>
        searching for events...
      </Text>
    </FallBackFrame>
  )

  const ErrorState = (
    <FallBackFrame>
      <Icon as={WarningOctagon} rounded="full" h={6} w={6} />
      <Text colorScheme="gray" fontSize="sm" align="center" mt={1}>
        Something went wrong during the loading of the events.
      </Text>
    </FallBackFrame>
  )

  const NoEventsState = (
    <FallBackFrame>
      <Icon as={NoteBlank} rounded="full" h={6} w={6} />
      <Text fontSize="xl">No events yet.</Text>
      <Text colorScheme="gray">
        Your guild has no upcoming event currently or you have no access to Discord
      </Text>
    </FallBackFrame>
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
        {isAdmin && (
          <TabButton href={`/${urlName}/activity`}>Activity log</TabButton>
        )}
      </Tabs>
      {isLoading && LoadingState}
      {!isLoading && isError && ErrorState}
      {!isLoading && !isError && data.length === 0 && NoEventsState}
      {!isLoading && !isError && data.length > 0 && (
        <VStack gap={5}>
          {data.map((event) => (
            <EventCard
              key={event.id}
              modal={
                <DiscordEventCard
                  event={event}
                  guildId={guildId}
                  showFullDescription
                  flexDirectionMd="column-reverse"
                />
              }
            >
              <DiscordEventCard event={event} guildId={guildId} cursorPointer />
            </EventCard>
          ))}
        </VStack>
      )}
    </Layout>
  )
}

const GuildEventsWrapper = (): JSX.Element => (
  <ThemeProvider>
    <GuildEvents />
  </ThemeProvider>
)

export default GuildEventsWrapper
