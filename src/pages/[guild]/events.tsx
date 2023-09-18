import { VStack } from "@chakra-ui/react"
import DiscordEventCard from "components/[guild]/Events/DiscordEventCard"
import FallbackFrame from "components/[guild]/Events/FallbackFrame"
import Tabs from "components/[guild]/Tabs"
import TabButton from "components/[guild]/Tabs/components/TabButton"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useIsMember from "components/[guild]/hooks/useIsMember"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import PulseMarker from "components/common/PulseMarker"
import useDiscordEvents, { DiscordEvent } from "hooks/useDiscordEvents"
import useLocalStorage from "hooks/useLocalStorage"
import dynamic from "next/dynamic"
import { NoteBlank, WarningOctagon } from "phosphor-react"
import { PlatformType } from "types"

const DynamicEditGuildButton = dynamic(() => import("components/[guild]/EditGuild"))

const GuildEvents = (): JSX.Element => {
  const {
    id: guildId,
    name,
    imageUrl,
    urlName,
    guildPlatforms,
    onboardingComplete,
    isDetailed,
  } = useGuild()
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()
  const [eventsSeen, setEventsSeen] = useLocalStorage<boolean>("eventsSeen", false)
  const { isAdmin } = useGuildPermission()
  const isMember = useIsMember()

  const showOnboarding = isAdmin && !onboardingComplete

  const showAccessHub =
    (guildPlatforms?.some(
      (guildPlatform) => guildPlatform.platformId === PlatformType.CONTRACT_CALL
    ) ||
      isMember ||
      isAdmin) &&
    !showOnboarding

  const discordGuildPlatform = guildPlatforms?.find(
    (platform) => platform.platformId === PlatformType.DISCORD
  )

  const { data, isLoading, error } = useDiscordEvents(
    discordGuildPlatform?.platformGuildId
  )

  const sortEventByStartDate = (eventA: DiscordEvent, eventB: DiscordEvent) =>
    eventA.scheduledStartTimestamp - eventB.scheduledStartTimestamp

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
      action={isAdmin && isDetailed && <DynamicEditGuildButton />}
      textColor={textColor}
      background={localThemeColor}
      backgroundImage={localBackgroundImage}
      backButton={{ href: "/explorer", text: "Go back to explorer" }}
    >
      <Tabs>
        <TabButton href={`/${urlName}`}>
          {showAccessHub ? "Home" : "Roles"}
        </TabButton>
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
        <VStack gap={4}>
          {data.sort(sortEventByStartDate).map((event) => (
            <DiscordEventCard key={event.id} event={event} guildId={guildId} />
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
