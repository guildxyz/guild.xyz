import { HStack, Link, VStack, Wrap } from "@chakra-ui/react"
import { EditGuildDrawerProvider } from "components/[guild]/EditGuild/EditGuildDrawerContext"
import EventCard from "components/[guild]/Events/EventCard"
import FallbackFrame from "components/[guild]/Events/FallbackFrame"
import GuildName from "components/[guild]/GuildName"
import SocialIcon from "components/[guild]/SocialIcon"
import GuildTabs from "components/[guild]/Tabs/GuildTabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import ErrorAlert from "components/common/ErrorAlert"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import BackButton from "components/common/Layout/components/BackButton"
import useGuildEvents, { GuildEvent } from "hooks/useGuildEvents"
import { GetStaticPaths, GetStaticProps } from "next"
import dynamic from "next/dynamic"
import { NoteBlank } from "phosphor-react"
import { SWRConfig } from "swr"
import { Guild, SocialLinkKey } from "types"
import parseDescription from "utils/parseDescription"
import fetcher from "../../utils/fetcher"

const DynamicEditGuildButton = dynamic(() => import("components/[guild]/EditGuild"))

const GuildEvents = (): JSX.Element => {
  const {
    id: guildId,
    name,
    imageUrl,
    isDetailed,
    description,
    socialLinks,
    tags,
  } = useGuild()
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()
  const { isAdmin } = useGuildPermission()

  const { data, isValidating, error, serverError } = useGuildEvents()

  const sortEventByStartDate = (eventA: GuildEvent, eventB: GuildEvent) =>
    eventA.start - eventB.start

  return (
    <Layout
      title={<GuildName {...{ name, tags }} />}
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
      backButton={<BackButton />}
    >
      <GuildTabs activeTab="EVENTS" />
      {(isValidating || data === undefined) && (
        <FallbackFrame isLoading text="Searching for events..." />
      )}
      {!isValidating && data?.length === 0 && (
        <FallbackFrame
          icon={NoteBlank}
          title="No upcoming events"
          text="There aren't any upcoming events currently"
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

const GuildEventsWrapper = ({ fallback }): JSX.Element => (
  <SWRConfig value={fallback && { fallback }}>
    <ThemeProvider>
      <EditGuildDrawerProvider>
        <GuildEvents />
      </EditGuildDrawerProvider>
    </ThemeProvider>
  </SWRConfig>
)

const getStaticProps: GetStaticProps = async ({ params }) => {
  const endpoint = `/v2/guilds/guild-page/${params.guild}`
  const guild: Guild = await fetcher(endpoint).catch((_) => ({}))

  if (!guild.id)
    return {
      notFound: true,
    }

  guild.isFallback = true

  return {
    props: {
      fallback: {
        [endpoint]: guild,
      },
    },
  }
}

const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
})

export default GuildEventsWrapper
export { getStaticPaths, getStaticProps }
