import { VStack } from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import PulseMarker from "components/common/PulseMarker"
import DiscordEventCard, {
  DiscordEventModal,
} from "components/[guild]/Events/components/DiscordEventCard"
import EventCard from "components/[guild]/Events/EventCard"
import FallbackFrame from "components/[guild]/Events/FallbackFrame"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import Tabs from "components/[guild]/Tabs"
import TabButton from "components/[guild]/Tabs/components/TabButton"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useDiscordEvents from "hooks/useDiscordEvents"
import useLocalStorage from "hooks/useLocalStorage"
import { NoteBlank, WarningOctagon } from "phosphor-react"
import { PlatformType } from "types"

const GuildEvents = (): JSX.Element => {
  const { id: guildId, name, imageUrl, urlName, guildPlatforms } = useGuild()
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()
  const [eventsSeen, setEventsSeen] = useLocalStorage<boolean>("eventsSeen", false)
  const { isAdmin } = useGuildPermission()

  const discordGuildPlatform = guildPlatforms?.find(
    (platform) => platform.platformId === PlatformType.DISCORD
  )

  const { data, isLoading, error } = useDiscordEvents(
    discordGuildPlatform?.platformGuildId
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
      {((!data && !error) || isLoading) && (
        <FallbackFrame isLoading text="Searching for events..." />
      )}

      {!isLoading && !!error && (
        <FallbackFrame
          icon={WarningOctagon}
          text="Something went wrong, couldn't load events."
        />
      )}

      {!isLoading && !error && data?.length === 0 && (
        <FallbackFrame
          icon={NoteBlank}
          title="No events yet"
          text="Your guild has no upcoming event currently or you have no access to Discord"
        />
      )}

      {!isLoading && !error && data?.length > 0 && (
        <VStack gap={5}>
          {data.map((event) => (
            <EventCard
              key={event.id}
              modal={<DiscordEventModal event={event} guildId={guildId} />}
            >
              <DiscordEventCard event={event} guildId={guildId} />
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
