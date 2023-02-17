import {
  Box,
  Center,
  Collapse,
  Heading,
  HStack,
  Icon,
  Link,
  Spinner,
  Stack,
  Tag,
  TagLeftIcon,
  Text,
  Wrap,
} from "@chakra-ui/react"
import { WithRumComponentContext } from "@datadog/rum-react-integration"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import Section from "components/common/Section"
import AccessHub from "components/[guild]/AccessHub"
import useAccess from "components/[guild]/hooks/useAccess"
import useAutoStatusUpdate from "components/[guild]/hooks/useAutoStatusUpdate"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useIsMember from "components/[guild]/hooks/useIsMember"
import JoinButton from "components/[guild]/JoinButton"
import JoinModalProvider from "components/[guild]/JoinModal/JoinModalProvider"
import LeaveButton from "components/[guild]/LeaveButton"
import Members from "components/[guild]/Members"
import OnboardingProvider from "components/[guild]/Onboarding/components/OnboardingProvider"
import RoleCard from "components/[guild]/RoleCard/RoleCard"
import SocialIcon from "components/[guild]/SocialIcon"
import Tabs from "components/[guild]/Tabs/Tabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useScrollEffect from "hooks/useScrollEffect"
import useUniqueMembers from "hooks/useUniqueMembers"
import { GetStaticPaths, GetStaticProps } from "next"
import dynamic from "next/dynamic"
import Head from "next/head"
import ErrorPage from "pages/_error"
import { Info, Users } from "phosphor-react"
import React, { useMemo, useRef, useState } from "react"
import { SWRConfig } from "swr"
import { Guild, SocialLinkKey } from "types"
import fetcher from "utils/fetcher"
import parseDescription from "utils/parseDescription"

const BATCH_SIZE = 10

const DynamicEditGuildButton = dynamic(() => import("components/[guild]/EditGuild"))
const DynamicAddRoleButton = dynamic(
  () => import("components/[guild]/AddRoleButton")
)
const DynamicAddRewardButton = dynamic(
  () => import("components/[guild]/AddRewardButton")
)
const DynamicMembersExporter = dynamic(
  () => import("components/[guild]/Members/components/MembersExporter")
)
const DynamicOnboarding = dynamic(() => import("components/[guild]/Onboarding"))
const DynamicNoRolesAlert = dynamic(() => import("components/[guild]/NoRolesAlert"))
const DynamicActiveStatusUpdates = dynamic(
  () => import("components/[guild]/ActiveStatusUpdates")
)

const GuildPage = (): JSX.Element => {
  const {
    name,
    description,
    imageUrl,
    admins,
    showMembers,
    memberCount,
    roles,
    isLoading,
    onboardingComplete,
    socialLinks,
  } = useGuild()

  useAutoStatusUpdate()

  const { data: roleAccesses } = useAccess()

  const sortedRoles = useMemo(() => {
    const byMembers = roles?.sort(
      (role1, role2) => role2.memberCount - role1.memberCount
    )
    if (!roleAccesses) return byMembers

    // prettier-ignore
    const accessedRoles = [], otherRoles = []
    byMembers?.forEach((role) =>
      (roleAccesses?.find(({ roleId }) => roleId === role.id)?.access
        ? accessedRoles
        : otherRoles
      ).push(role)
    )
    return accessedRoles.concat(otherRoles)
  }, [roles, roleAccesses])

  // TODO: we use this behaviour in multiple places now, should make a useScrollBatchedRendering hook
  const [renderedRolesCount, setRenderedRolesCount] = useState(BATCH_SIZE)
  const rolesEl = useRef(null)
  useScrollEffect(() => {
    if (
      !rolesEl.current ||
      rolesEl.current.getBoundingClientRect().bottom > window.innerHeight ||
      roles?.length <= renderedRolesCount
    )
      return

    setRenderedRolesCount((prevValue) => prevValue + BATCH_SIZE)
  }, [roles, renderedRolesCount])

  const renderedRoles = sortedRoles?.slice(0, renderedRolesCount) || []

  const { isAdmin } = useGuildPermission()
  const isMember = useIsMember()

  // Passing the admin addresses here to make sure that we render all admin avatars in the members list
  const members = useUniqueMembers(
    roles,
    admins?.map((admin) => admin.address)
  )

  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()
  const [isAddRoleStuck, setIsAddRoleStuck] = useState(false)

  // not importing it dynamically because that way the whole page flashes once when it loads
  const DynamicOnboardingProvider =
    isAdmin && !onboardingComplete ? OnboardingProvider : React.Fragment

  const showOnboarding = isAdmin && !onboardingComplete
  const showAccessHub = (isMember || isAdmin) && !showOnboarding

  const hexToRGB = (hex: string) => {
    //where to move this?
    hex = hex?.startsWith("#") ? hex.slice(1) : hex
    if (hex.length === 3) {
      hex = Array.from(hex).reduce((str, x) => str + x + x, "")
    }
    const values = hex
      .split(/([a-z0-9]{2,2})/)
      .filter(Boolean)
      .map((x) => parseInt(x, 16))
    return `${values.length == 4 ? "a" : ""}${values.join(", ")}`
  }

  return (
    <DynamicOnboardingProvider>
      <Head>
        <meta
          name="theme-color"
          content={`rgba(${hexToRGB(localThemeColor)}, 0.5)`}
        />
      </Head>
      <Layout
        title={name}
        textColor={textColor}
        ogDescription={description}
        description={
          <>
            {description && parseDescription(description)}
            {Object.keys(socialLinks ?? {}).length > 0 && (
              <Wrap w="full" spacing={3} mt="3">
                {Object.entries(socialLinks).map(([type, link]) => (
                  <HStack key={type} spacing={1.5}>
                    <SocialIcon type={type as SocialLinkKey} size="sm" />
                    <Link
                      href={link?.startsWith("http") ? link : `https://${link}`}
                      isExternal
                      fontSize="sm"
                      fontWeight="semibold"
                      color={textColor}
                    >
                      {link.replace(/(http(s)?:\/\/)*(www\.)*/i, "")}
                    </Link>
                  </HStack>
                ))}
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
        background={localThemeColor}
        backgroundImage={localBackgroundImage}
        action={isAdmin && <DynamicEditGuildButton />}
        showBackButton
      >
        {showOnboarding ? (
          <DynamicOnboarding />
        ) : (
          <Tabs tabTitle={showAccessHub ? "Home" : "Roles"}>
            {!isMember ? (
              <JoinButton />
            ) : !isAdmin ? (
              <LeaveButton />
            ) : isAddRoleStuck ? (
              <DynamicAddRoleButton />
            ) : (
              <DynamicAddRewardButton />
            )}
          </Tabs>
        )}

        <Collapse in={showAccessHub} unmountOnExit>
          <AccessHub />
        </Collapse>

        <Section
          title={(showAccessHub || showOnboarding) && "Roles"}
          titleRightElement={
            isAdmin &&
            (showAccessHub || showOnboarding) && (
              <Box my="-2 !important" ml="auto !important">
                <DynamicAddRoleButton setIsStuck={setIsAddRoleStuck} />
              </Box>
            )
          }
          mb="12"
        >
          {renderedRoles.length ? (
            <Stack ref={rolesEl} spacing={4}>
              {renderedRoles.map((role) => (
                <RoleCard key={role.id} role={role} />
              ))}
            </Stack>
          ) : (
            <DynamicNoRolesAlert />
          )}

          {roles?.length > renderedRolesCount && (
            <Center pt={6}>
              <Spinner />
            </Center>
          )}
        </Section>

        {(showMembers || isAdmin) && (
          <Section
            title="Members"
            titleRightElement={
              <HStack justifyContent="space-between" w="full" my="-2 !important">
                <Tag maxH={6} pt={0.5}>
                  <TagLeftIcon as={Users} />
                  {isLoading ? (
                    <Spinner size="xs" />
                  ) : (
                    new Intl.NumberFormat("en", { notation: "compact" }).format(
                      memberCount ?? 0
                    ) ?? 0
                  )}
                </Tag>
                {isAdmin && <DynamicMembersExporter />}
              </HStack>
            }
          >
            <Box>
              {isAdmin && <DynamicActiveStatusUpdates />}
              {showMembers ? (
                <>
                  <Members members={members} />
                  {/* Temporary until the BE returns members again  */}
                  <Text mt="6" colorScheme={"gray"}>
                    <Icon as={Info} mr="2" mb="-2px" />
                    Members are temporarily hidden, only admins are shown
                  </Text>
                </>
              ) : (
                <Text>Members are hidden</Text>
              )}
            </Box>
          </Section>
        )}
      </Layout>
    </DynamicOnboardingProvider>
  )
}

type Props = {
  fallback: { string: Guild }
}

const GuildPageWrapper = ({ fallback }: Props): JSX.Element => {
  const guild = useGuild()

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
          <JoinModalProvider>
            <GuildPage />
          </JoinModalProvider>
        </ThemeProvider>
      </SWRConfig>
    </>
  )
}

const getStaticProps: GetStaticProps = async ({ params }) => {
  const endpoint = `/guild/${params.guild?.toString()}`

  const data = await fetcher(endpoint).catch((_) => ({}))

  if (!data?.id)
    return {
      props: {},
      revalidate: 10,
    }

  // Removing the members list, and then we refetch them on client side. This way the members won't be included in the SSG source code.
  const filteredData = { ...data }
  filteredData.roles?.forEach((role) => (role.members = []))

  // Fetching requirements client-side in this case
  if (filteredData.roles?.some((role) => role.requirements?.length > 10)) {
    filteredData.roles?.forEach((role) => (role.requirements = []))
  }

  return {
    props: {
      fallback: {
        [endpoint]: filteredData,
      },
    },
    revalidate: 10,
  }
}

const SSG_PAGES_COUNT = 24
const getStaticPaths: GetStaticPaths = async () => {
  const mapToPaths = (_: Guild[]) =>
    Array.isArray(_)
      ? _.slice(0, SSG_PAGES_COUNT).map(({ urlName: guild }) => ({
          params: { guild },
        }))
      : []

  const paths = await fetcher(`/guild`).then(mapToPaths)

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }

export default WithRumComponentContext("Guild page", GuildPageWrapper)
