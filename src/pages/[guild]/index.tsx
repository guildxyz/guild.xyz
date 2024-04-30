import {
  Box,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
  Link,
  Spinner,
  Tag,
  TagLeftIcon,
  Text,
  Wrap,
} from "@chakra-ui/react"
import AccessHub from "components/[guild]/AccessHub"
import { useAccessedGuildPlatforms } from "components/[guild]/AccessHub/AccessHub"
import {
  EditGuildDrawerProvider,
  useEditGuildDrawer,
} from "components/[guild]/EditGuild/EditGuildDrawerContext"
import GuildName from "components/[guild]/GuildName"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import JoinButton from "components/[guild]/JoinButton"
import JoinModalProvider from "components/[guild]/JoinModal/JoinModalProvider"
import LeaveButton from "components/[guild]/LeaveButton"
import Members from "components/[guild]/Members"
import { MintGuildPinProvider } from "components/[guild]/Requirements/components/GuildCheckout/MintGuildPinContext"
import Roles from "components/[guild]/Roles"
import SocialIcon from "components/[guild]/SocialIcon"
import useStayConnectedToast from "components/[guild]/StayConnectedToast"
import GuildTabs from "components/[guild]/Tabs/GuildTabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import { addIntercomSettings } from "components/_app/IntercomProvider"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import BackButton from "components/common/Layout/components/BackButton"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import Section from "components/common/Section"
import useMembership from "components/explorer/hooks/useMembership"
import useUniqueMembers from "hooks/useUniqueMembers"
import { GetStaticPaths, GetStaticProps } from "next"
import dynamic from "next/dynamic"
import Head from "next/head"
import ErrorPage from "pages/_error"
import { Info, Users } from "phosphor-react"
import { MintPolygonIDProofProvider } from "platforms/PolygonID/components/MintPolygonIDProofProvider"
import { useEffect, useState } from "react"
import { SWRConfig } from "swr"
import { Guild, SocialLinkKey } from "types"
import fetcher from "utils/fetcher"
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
const DynamicOnboarding = dynamic(() => import("components/[guild]/Onboarding"))
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
    admins,
    memberCount,
    roles,
    isLoading,
    onboardingComplete,
    socialLinks,
    tags,
    featureFlags,
    isDetailed,
  } = useGuild()

  const { isAdmin } = useGuildPermission()
  const { isMember } = useMembership()
  const { onOpen } = useEditGuildDrawer()

  // Passing the admin addresses here to make sure that we render all admin avatars in the members list
  const members = useUniqueMembers(
    roles,
    admins?.map((admin) => admin.address)
  )

  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()
  const [isAddRoleStuck, setIsAddRoleStuck] = useState(false)

  const showOnboarding = isAdmin && !onboardingComplete
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

      <Layout
        title={<GuildName {...{ name, tags }} />}
        ogTitle={name}
        textColor={textColor}
        ogDescription={description}
        description={
          (description || Object.keys(socialLinks ?? {}).length > 0) && (
            <>
              {description && parseDescription(description)}
              {Object.keys(socialLinks ?? {}).length > 0 && (
                <Wrap w="full" spacing={3} mt="3">
                  {Object.entries(socialLinks).map(([type, link]) => {
                    const prettyLink = link
                      .replace(/(http(s)?:\/\/)*(www\.)*/i, "")
                      .replace(/\?.*/, "") // trim query params
                      .replace(/\/+$/, "") // trim ending slash

                    return (
                      <HStack key={type} spacing={1.5} maxW="full">
                        <SocialIcon type={type as SocialLinkKey} size="sm" />
                        <Link
                          href={link?.startsWith("http") ? link : `https://${link}`}
                          isExternal
                          fontSize="sm"
                          fontWeight="semibold"
                          color={textColor}
                          noOfLines={1}
                        >
                          {prettyLink}
                        </Link>
                      </HStack>
                    )
                  })}
                </Wrap>
              )}
            </>
          )
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
        backgroundOffset={showOnboarding ? 70 : undefined}
        backgroundImage={localBackgroundImage}
        action={isAdmin && isDetailed && <DynamicEditGuildButton />}
        backButton={<BackButton />}
      >
        {showOnboarding ? (
          <DynamicOnboarding />
        ) : (
          <GuildTabs
            activeTab="HOME"
            rightElement={
              <HStack>
                {isMember && !isAdmin && <DynamicRecheckAccessesButton />}
                {!isMember ? (
                  <JoinButton />
                ) : !isAdmin ? (
                  <LeaveButton />
                ) : isAddRoleStuck ? (
                  <DynamicAddAndOrderRoles />
                ) : (
                  <DynamicAddRewardAndCampaign />
                )}
              </HStack>
            }
          />
        )}

        <AccessHub />

        <Section
          title={
            (isAdmin || isMember || !!accessedGuildPlatforms?.length) && "Roles"
          }
          titleRightElement={
            isAdmin && (
              <Box my="-2 !important" ml="auto !important">
                <DynamicAddAndOrderRoles setIsStuck={setIsAddRoleStuck} />
              </Box>
            )
          }
          mb="10"
        >
          <Roles />
        </Section>

        {/* we'll remove Members section completely, just keeping it for admins for now because of the Members exporter */}
        {isAdmin && (
          <>
            <Divider my={10} />
            <Section
              title="Members"
              titleRightElement={
                <HStack justifyContent="space-between" w="full" my="-2 !important">
                  <Tag maxH={6} pt={0.5}>
                    <TagLeftIcon as={Users} />
                    {isLoading ? (
                      <Spinner size="xs" />
                    ) : (
                      new Intl.NumberFormat("en", {
                        notation: "compact",
                      }).format(memberCount ?? 0) ?? 0
                    )}
                  </Tag>
                  {isAdmin && <DynamicMembersExporter />}
                </HStack>
              }
            >
              <Box>
                {isAdmin && <DynamicActiveStatusUpdates />}

                <Members members={members} />
                <Text mt="6" colorScheme={"gray"}>
                  <Icon as={Info} mr="2" mb="-2px" />
                  Members section is only visible to admins and is under rework,
                  until then only admins are shown
                </Text>
              </Box>
            </Section>
          </>
        )}
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
      <LinkPreviewHead
        path={fallback ? Object.values(fallback)[0].urlName : guild.urlName}
      />
      <Head>
        <title>{fallback ? Object.values(fallback)[0].name : guild.name}</title>
        <meta
          property="og:title"
          content={fallback ? Object.values(fallback)[0].name : guild.name}
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
