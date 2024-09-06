import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import {
  Box,
  Divider,
  HStack,
  Heading,
  SimpleGrid,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react"
import { ThemeProvider } from "components/[guild]/ThemeContext"
import ClaimPoap from "components/[guild]/claim-poap/components/ClaimPoap"
import PoapImage from "components/[guild]/claim-poap/components/PoapImage"
import SocialLinks from "components/[guild]/claim-poap/components/SocialLinks"
import GuildImageAndName from "components/[guild]/collect/components/GuildImageAndName"
import RequirementsCard from "components/[guild]/collect/components/RequirementsCard"
import ShareAndReportButtons from "components/[guild]/collect/components/ShareAndReportButtons"
import SmallImageAndRoleName from "components/[guild]/collect/components/SmallImageAndRoleName"
import useShouldShowSmallImage from "components/[guild]/collect/hooks/useShouldShowSmallImage"
import useGuild from "components/[guild]/hooks/useGuild"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import { AnimatePresence } from "framer-motion"
import { GetStaticPaths, GetStaticProps } from "next"
import ErrorPage from "pages/_error"
import { useRef } from "react"
import { ErrorBoundary } from "react-error-boundary"
import usePoapById from "requirements/Poap/hooks/usePoapById"
import { SWRConfig } from "swr"
import { Guild } from "types"
import fetcher from "utils/fetcher"

type Props = {
  fancyId: string
  fallback: { [x: string]: Guild }
}

const Page = ({ fancyId }: Omit<Props, "fallback">) => {
  const { theme, urlName, roles, guildPlatforms, socialLinks } = useGuild()

  const { captureEvent } = usePostHogContext()

  const guildPlatform = guildPlatforms?.find(
    (gp) => gp.platformGuildData?.fancyId === fancyId
  )

  const { name } = guildPlatform?.platformGuildData ?? {}

  const { poap, isPoapByIdLoading } = usePoapById(fancyId)

  const rolePlatform = roles
    ?.flatMap((role) => role.rolePlatforms)
    .find((rp) => rp.guildPlatformId === guildPlatform?.id)
  const role = roles?.find((r) => r.id === rolePlatform?.roleId)

  const isMobile = useBreakpointValue({ base: true, md: false })

  const poapDescriptionRef = useRef<HTMLDivElement>(null)
  const shouldShowSmallImage = useShouldShowSmallImage(poapDescriptionRef)

  // if (!isFallback && !guildPlatform) return <ErrorPage statusCode={404} />

  return (
    <ErrorBoundary
      onError={(error, info) => {
        captureEvent("ErrorBoundary catched error", {
          page: "[guild]/claim-poap/[fancyId]",
          guild: urlName,
          poap: fancyId,
          error,
          info,
        })
      }}
      fallback={<ErrorPage />}
    >
      <Layout
        ogTitle="Claim POAP"
        background={theme?.color ?? "gray.900"}
        backgroundImage={theme?.backgroundImage}
        maxWidth="container.xl"
      >
        <Stack spacing={4}>
          <HStack justifyContent="space-between">
            <GuildImageAndName />
            <ShareAndReportButtons
              isPulseMarkerHidden={rolePlatform?.claimedCount > 0}
              shareButtonLocalStorageKey={`poap_${fancyId}_hasClickedShareButton`}
              shareText={`Check out and claim the ${`${name} `}POAP on Guild!`}
            />
          </HStack>

          <SimpleGrid
            templateColumns={{
              base: "1fr",
              md: "7fr 5fr",
            }}
            gap={{ base: 6, lg: 8 }}
          >
            <Stack overflow="hidden" w="full" spacing={{ base: 6, lg: 8 }}>
              <PoapImage src={poap?.image_url} isLoading={isPoapByIdLoading} />

              <Stack spacing={6}>
                <Heading
                  as="h2"
                  fontFamily="display"
                  fontSize={{ base: "3xl", lg: "4xl" }}
                >
                  {name}
                </Heading>

                {isMobile && (
                  <RequirementsCard role={role}>
                    <ClaimPoap rolePlatformId={rolePlatform?.id} />
                  </RequirementsCard>
                )}

                <Box ref={poapDescriptionRef} lineHeight={1.75}>
                  {poap?.description}
                </Box>
              </Stack>

              {!!Object.keys(socialLinks ?? {}).length && (
                <>
                  <Divider />
                  <SocialLinks socialLinks={socialLinks} />
                </>
              )}
            </Stack>

            {!isMobile && (
              <AnimatePresence>
                <Stack
                  position="sticky"
                  top={{ base: 4, md: 5 }}
                  spacing={8}
                  h="max-content"
                >
                  {shouldShowSmallImage && (
                    <SmallImageAndRoleName
                      imageElement={
                        <PoapImage
                          src={poap?.image_url}
                          isLoading={isPoapByIdLoading}
                        />
                      }
                      name={name}
                      role={role}
                    />
                  )}

                  <RequirementsCard role={role}>
                    <ClaimPoap rolePlatformId={rolePlatform?.id} />
                  </RequirementsCard>
                </Stack>
              </AnimatePresence>
            )}
          </SimpleGrid>
        </Stack>
      </Layout>
    </ErrorBoundary>
  )
}

const ClaimPoapPage = ({ fallback, ...rest }: Props) => (
  <SWRConfig value={fallback && { fallback }}>
    <LinkPreviewHead path={Object.values(fallback ?? {})[0]?.urlName ?? ""} />
    <ThemeProvider>
      <Page {...rest} />
    </ThemeProvider>
  </SWRConfig>
)

const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const { guild: urlName, fancyId: fancyIdFromParams } = params

  const fancyId = fancyIdFromParams?.toString()

  if (!fancyId)
    return {
      notFound: true,
      revalidate: 300,
    }

  const endpoint = `/v2/guilds/guild-page/${urlName}`
  const guild: Guild = await fetcher(endpoint).catch((_) => ({}))

  if (!guild?.id)
    return {
      notFound: true,
      revalidate: 300,
    }

  guild.isFallback = true

  return {
    props: {
      fancyId,
      fallback: {
        [endpoint]: guild,
      },
    },
  }
}

const getStaticPaths: GetStaticPaths = () => ({
  /**
   * We don't know the paths in advance, but since we're using fallback: blocking,
   * the pages will be generated on-the-fly, and from that point we'll serve them
   * from cache
   */
  paths: [],
  fallback: "blocking",
})

export default ClaimPoapPage
export { getStaticPaths, getStaticProps }
