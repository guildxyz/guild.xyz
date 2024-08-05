import { CheckMark } from "@/components/CheckMark"
import { Header } from "@/components/Header"
import {
  Layout,
  LayoutBanner,
  LayoutHeadline,
  LayoutHero,
  LayoutMain,
  LayoutTitle,
} from "@/components/Layout"
import { LayoutContainer, LayoutFooter } from "@/components/Layout/Layout"
import { Anchor } from "@/components/ui/Anchor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Skeleton } from "@/components/ui/Skeleton"
import { cn } from "@/lib/utils"
import { Box, Center, HStack, Heading, Spinner } from "@chakra-ui/react"
import { Users } from "@phosphor-icons/react/dist/ssr"
import AccessHub from "components/[guild]/AccessHub"
import { useAccessedGuildPlatforms } from "components/[guild]/AccessHub/AccessHub"
import { useEditGuildDrawer } from "components/[guild]/EditGuild/EditGuildDrawerContext"
import { EditGuildDrawerProvider } from "components/[guild]/EditGuild/EditGuildDrawerProvider"
import JoinButton from "components/[guild]/JoinButton"
import JoinModalProvider from "components/[guild]/JoinModal/JoinModalProvider"
import LeaveButton from "components/[guild]/LeaveButton"
import { MintGuildPinProvider } from "components/[guild]/Requirements/components/GuildCheckout/MintGuildPinContext"
import Roles from "components/[guild]/Roles"
import SocialIcon from "components/[guild]/SocialIcon"
import useStayConnectedToast from "components/[guild]/StayConnectedToast"
import GuildTabs from "components/[guild]/Tabs/GuildTabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import BackButton from "components/common/Layout/components/BackButton"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import Section from "components/common/Section"
import useMembership from "components/explorer/hooks/useMembership"
import { GetStaticPaths, GetStaticProps } from "next"
import dynamic from "next/dynamic"
import Head from "next/head"
import Image from "next/image"
import ErrorPage from "pages/_error"
import { useEffect } from "react"
import { MintPolygonIDProofProvider } from "rewards/PolygonID/components/MintPolygonIDProofProvider"
import { SWRConfig } from "swr"
import { Guild, SocialLinkKey } from "types"
import fetcher from "utils/fetcher"
import { addIntercomSettings } from "utils/intercom"
import parseDescription from "utils/parseDescription"

const DynamicOngoingIssuesBanner = dynamic(
  () => import("components/[guild]/OngoingIssuesBanner")
)
const DynamicEditGuildButton = dynamic(() => import("components/[guild]/EditGuild"))
const DynamicAddAndOrderRoles = dynamic(
  () => import("components/[guild]/AddAndOrderRoles")
)
const DynamicAddRewardAndCampaign = dynamic(
  () => import("components/[guild]/AddRewardAndCampaign")
)
const DynamicMembersExporter = dynamic(
  () => import("components/[guild]/Members/components/MembersExporter")
)
const DynamicActiveStatusUpdates = dynamic(
  () => import("components/[guild]/ActiveStatusUpdates")
)
const DynamicRecheckAccessesButton = dynamic(() =>
  import("components/[guild]/RecheckAccessesButton").then(
    (module) => module.TopRecheckAccessesButton
  )
)
const DynamicDiscordBotPermissionsChecker = dynamic(
  () => import("components/[guild]/DiscordBotPermissionsChecker"),
  {
    ssr: false,
  }
)

const GuildPage = (): JSX.Element => {
  const {
    name,
    description,
    imageUrl,
    memberCount,
    socialLinks,
    tags,
    featureFlags,
    isDetailed,
  } = useGuild()

  const { isAdmin } = useGuildPermission()
  const { isMember } = useMembership()
  const { onOpen } = useEditGuildDrawer()

  const { avatarBg, localThemeColor, localBackgroundImage } = useThemeContext()

  const accessedGuildPlatforms = useAccessedGuildPlatforms()

  useStayConnectedToast(() => {
    onOpen()
    setTimeout(() => {
      const addContactBtn = document.getElementById("add-contact-btn")
      if (addContactBtn) addContactBtn.focus()
    }, 200)
  })

  return (
    <>
      <Head>
        <meta name="theme-color" content={localThemeColor} />
      </Head>

      {featureFlags?.includes("ONGOING_ISSUES") && <DynamicOngoingIssuesBanner />}

      <Layout>
        <LayoutHero className="pb-28">
          <LayoutBanner>
            {localBackgroundImage ? (
              <Image
                src={localBackgroundImage}
                alt="Guild background image"
                priority
                fill
                sizes="100vw"
                style={{
                  filter: "brightness(30%)",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                className="h-full w-full opacity-banner"
                style={{
                  backgroundColor: localThemeColor,
                }}
              />
            )}
          </LayoutBanner>

          <Header className="mb-10" />

          <LayoutContainer className="-mb-16 mt-8">
            <BackButton />
          </LayoutContainer>

          <LayoutHeadline className="pt-12">
            {imageUrl && (
              <Avatar className={cn("row-span-2 size-20 md:size-24", avatarBg)}>
                <AvatarImage
                  src={imageUrl}
                  alt={`${name} logo`}
                  width={96}
                  height={96}
                />
                <AvatarFallback>
                  <Skeleton className="size-full" />
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-1 sm:gap-1.5">
                <LayoutTitle className="line-clamp-1 break-all leading-tight sm:leading-tight">
                  {name}
                </LayoutTitle>
                {tags?.includes("VERIFIED") && (
                  <CheckMark className="mt-2.5 size-5 shrink-0 sm:mt-4 sm:size-6" />
                )}
              </div>

              <Badge className="text-banner-foreground">
                <Users weight="bold" />
                {new Intl.NumberFormat("en", { notation: "compact" }).format(
                  memberCount ?? 0
                )}
              </Badge>
            </div>

            {isAdmin && isDetailed && <DynamicEditGuildButton />}
          </LayoutHeadline>

          {(description || Object.keys(socialLinks ?? {}).length > 0) && (
            <LayoutContainer className="mt-6 font-semibold">
              {description && parseDescription(description)}
              {Object.keys(socialLinks ?? {}).length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {Object.entries(socialLinks ?? {}).map(([type, link]) => {
                    const prettyLink = link
                      .replace(/(http(s)?:\/\/)*(www\.)*/i, "")
                      .replace(/\?.*/, "") // trim query params
                      .replace(/\/+$/, "") // trim ending slash

                    return (
                      <div key={type} className="flex items-center gap-1.5">
                        <SocialIcon type={type as SocialLinkKey} size="sm" />
                        <Anchor
                          href={link?.startsWith("http") ? link : `https://${link}`}
                          className="font-semibold text-banner-foreground text-sm"
                        >
                          {prettyLink}
                        </Anchor>
                      </div>
                    )
                  })}
                </div>
              )}
            </LayoutContainer>
          )}
        </LayoutHero>

        <LayoutMain className="-top-16">
          <GuildTabs
            activeTab="HOME"
            rightElement={
              <HStack>
                {isMember && !isAdmin && <DynamicRecheckAccessesButton />}
                {!isMember ? (
                  <JoinButton />
                ) : !isAdmin ? (
                  <LeaveButton />
                ) : (
                  <DynamicAddRewardAndCampaign />
                )}
              </HStack>
            }
          />

          <AccessHub />

          <Section
            title={
              (isAdmin || isMember || !!accessedGuildPlatforms?.length) && "Roles"
            }
            titleRightElement={
              isAdmin && (
                <Box my="-2 !important" ml="auto !important">
                  <DynamicAddAndOrderRoles />
                </Box>
              )
            }
            mb="10"
          >
            <Roles />
          </Section>

          {isAdmin && <DynamicMembersExporter />}
          {isAdmin && <DynamicActiveStatusUpdates />}
        </LayoutMain>

        <LayoutFooter />
      </Layout>

      {isAdmin && <DynamicDiscordBotPermissionsChecker />}
    </>
  )
}

type Props = {
  fallback: { string: Guild }
}

const GuildPageWrapper = ({ fallback }: Props): JSX.Element => {
  const guild = useGuild()

  useEffect(() => {
    if (!guild?.id) return

    addIntercomSettings({
      guildId: guild.id,
      featureFlags: guild.featureFlags?.toString(),
      memberCount: guild.memberCount,
    })
  }, [guild])

  if (!fallback) {
    if (guild.isLoading)
      return (
        <Center h="100vh" w="screen">
          <Spinner />
          <Heading fontFamily={"display"} size="md" ml="4" mb="1">
            Loading guild...
          </Heading>
        </Center>
      )

    if (!guild.id) return <ErrorPage statusCode={404} />
  }

  return (
    <>
      <LinkPreviewHead path={Object.values(fallback)[0].urlName} />
      <Head>
        <title>{Object.values(fallback)[0].name}</title>
        <meta property="og:title" content={Object.values(fallback)[0].name} />
        <link
          rel="shortcut icon"
          href={Object.values(fallback)[0].imageUrl ?? "/guild-icon.png"}
        />
        <meta name="description" content={Object.values(fallback)[0].description} />
        <meta
          property="og:description"
          content={Object.values(fallback)[0].description}
        />
      </Head>
      <SWRConfig value={fallback && { fallback }}>
        <ThemeProvider>
          <MintGuildPinProvider>
            <MintPolygonIDProofProvider>
              <JoinModalProvider>
                <EditGuildDrawerProvider>
                  <GuildPage />
                </EditGuildDrawerProvider>
              </JoinModalProvider>
            </MintPolygonIDProofProvider>
          </MintGuildPinProvider>
        </ThemeProvider>
      </SWRConfig>
    </>
  )
}

const getStaticProps: GetStaticProps = async ({ params }) => {
  const endpoint = `/v2/guilds/guild-page/${params.guild?.toString()}`

  const data = await fetcher(endpoint).catch((_) => ({}))

  if (!data?.id)
    return {
      props: {},
      revalidate: 300,
    }

  /**
   * Removing members and requirements, so they're not included in the SSG source
   * code, we only fetch them client side. Temporary until we switch to the new API
   * that won't return them on this endpoint anyway
   */
  const filteredData = { ...data }
  filteredData.roles?.forEach((role) => {
    role.members = []
    role.requirements = []
  })
  filteredData.isFallback = true

  return {
    props: {
      fallback: {
        [endpoint]: filteredData,
      },
    },
    revalidate: 300,
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  const mapToPaths = (_: Guild[]) =>
    Array.isArray(_)
      ? _.map(({ urlName: guild }) => ({
          params: { guild },
        }))
      : []

  const paths = await fetcher(`/v2/guilds`).then(mapToPaths)

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }

export default GuildPageWrapper
