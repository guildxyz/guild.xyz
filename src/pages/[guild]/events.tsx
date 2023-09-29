import { HStack, Link, VStack, Wrap } from "@chakra-ui/react"
import { EditGuildDrawerProvider } from "components/[guild]/EditGuild/EditGuildDrawerContext"
import EventCard from "components/[guild]/Events/EventCard"
import FallbackFrame from "components/[guild]/Events/FallbackFrame"
import SocialIcon from "components/[guild]/SocialIcon"
import Tabs from "components/[guild]/Tabs"
import TabButton from "components/[guild]/Tabs/components/TabButton"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useIsMember from "components/[guild]/hooks/useIsMember"
import ErrorAlert from "components/common/ErrorAlert"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import PulseMarker from "components/common/PulseMarker"
import VerifiedIcon from "components/common/VerifiedIcon"
import useGuildEvents, { GuildEvent } from "hooks/useGuildEvents"
import useLocalStorage from "hooks/useLocalStorage"
import dynamic from "next/dynamic"
import { NoteBlank } from "phosphor-react"
import { PlatformType, SocialLinkKey } from "types"
import parseDescription from "utils/parseDescription"

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
    description,
    socialLinks,
    tags,
  } = useGuild()
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()
  const [eventsSeen, setEventsSeen] = useLocalStorage<boolean>("eventsSeen", false)
  const { isAdmin } = useGuildPermission()
  const isMember = useIsMember()

  const showOnboarding = isAdmin && !onboardingComplete

  const showHomeButton =
    (guildPlatforms?.some(
      (guildPlatform) => guildPlatform.platformId === PlatformType.CONTRACT_CALL
    ) ||
      isMember ||
      isAdmin) &&
    !showOnboarding

  const { data, isValidating, error, serverError } = useGuildEvents()

  const sortEventByStartDate = (eventA: GuildEvent, eventB: GuildEvent) =>
    eventA.start - eventB.start

  return (
    <Layout
      title={name}
      textColor={textColor}
      ogTitle={`Events${name ? ` - ${name}` : ""}`}
      ogDescription={description}
      description={
        <>
          {description && parseDescription(description)}
          {Object.keys(socialLinks ?? {}).length > 0 && (
            <Wrap w="full" spacing={3} mt="3">
              {Object.entries(socialLinks).map(([type, link]) => {
                const prettyLink = link
                  .replace(/(http(s)?:\/\/)*(www\.)*/i, "")
                  .replace(/\/+$/, "")

                return (
                  <HStack key={type} spacing={1.5}>
                    <SocialIcon type={type as SocialLinkKey} size="sm" />
                    <Link
                      href={link?.startsWith("http") ? link : `https://${link}`}
                      isExternal
                      fontSize="sm"
                      fontWeight="semibold"
                      color={textColor}
                    >
                      {prettyLink}
                    </Link>
                  </HStack>
                )
              })}
            </Wrap>
          )}
        </>
      }
      image={
        <GuildLogo
          imageUrl={imageUrl}
          size={{ base: "56px", lg: "72px" }}
          mt={{ base: 1, lg: 2 }}
          bgColor={textColor === "primary.800" ? "primary.800" : "transparent"}
        />
      }
      imageUrl={imageUrl}
      background={localThemeColor}
      backgroundImage={localBackgroundImage}
      action={isAdmin && isDetailed && <DynamicEditGuildButton />}
      backButton={{ href: "/explorer", text: "Go back to explorer" }}
      titlePostfix={
        tags?.includes("VERIFIED") && (
          <VerifiedIcon size={{ base: 5, lg: 6 }} mt={-1} />
        )
      }
    >
      <Tabs>
        <TabButton href={`/${urlName}`}>
          {showHomeButton ? "Home" : "Roles"}
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
      {(isValidating || data === undefined) && (
        <FallbackFrame isLoading text="Searching for events..." />
      )}
      {!isValidating && data?.length === 0 && (
        <FallbackFrame
          icon={NoteBlank}
          title="No events yet"
          text="Your guild has no upcoming event currently or you have no access to Discord"
        />
      )}
      {!isValidating && data?.length > 0 && (
        <VStack gap={4}>
          {data.sort(sortEventByStartDate).map((event) => (
            <EventCard key={event.title} event={event} guildId={guildId} />
          ))}
        </VStack>
      )}
      {isAdmin && !isValidating && error.length ? (
        <ErrorAlert
          label={`"Couldn't fetch events from ${error
            .map((err) => (err.type ? err.type : null))
            .join(", ")}`}
          mt={4}
        />
      ) : null}
      {isAdmin && !isValidating && serverError.length ? (
        <ErrorAlert
          label={`"Couldn't fetch events from ${serverError
            .map((err) => err.type)
            .join(", ")}`}
          mt={4}
        />
      ) : null}
    </Layout>
  )
}

const GuildEventsWrapper = (): JSX.Element => (
  <ThemeProvider>
    <EditGuildDrawerProvider>
      <GuildEvents />
    </EditGuildDrawerProvider>
  </ThemeProvider>
)

export default GuildEventsWrapper
