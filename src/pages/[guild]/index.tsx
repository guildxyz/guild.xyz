import {
  Box,
  Center,
  Collapse,
  Heading,
  HStack,
  Spinner,
  Tag,
  Text,
  useBreakpointValue,
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
import Tabs from "components/[guild]/Tabs/Tabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useGuildMembers from "hooks/useGuildMembers"
import { GetStaticPaths, GetStaticProps } from "next"
import dynamic from "next/dynamic"
import ErrorPage from "pages/_error"
import React, { useEffect, useMemo, useState } from "react"
import { SWRConfig, useSWRConfig } from "swr"
import { Guild } from "types"
import fetcher from "utils/fetcher"

const GuildPage = (): JSX.Element => {
  const {
    name,
    description,
    imageUrl,
    showMembers,
    roles,
    isLoading,
    onboardingComplete,
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
    byMembers.forEach((role) =>
      (roleAccesses?.find(({ roleId }) => roleId === role.id)?.access
        ? accessedRoles
        : otherRoles
      ).push(role)
    )
    return accessedRoles.concat(otherRoles)
  }, [roles, roleAccesses])

  const [DynamicEditGuildButton, setDynamicEditGuildButton] = useState(null)
  const [DynamicAddRoleButton, setDynamicAddRoleButton] = useState(null)
  const [DynamicAddRewardButton, setDynamicAddRewardButton] = useState(null)
  const [DynamicMembersExporter, setDynamicMembersExporter] = useState(null)
  const [DynamicOnboarding, setDynamicOnboarding] = useState(null)

  const isMember = useIsMember()
  const { isAdmin, isOwner } = useGuildPermission()
  const members = useGuildMembers()
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

  const guildLogoSize = useBreakpointValue({ base: 56, lg: 72 })
  const guildLogoIconSize = useBreakpointValue({ base: 28, lg: 36 })

  useEffect(() => {
    if (isAdmin) {
      const EditGuildButton = dynamic(() => import("components/[guild]/EditGuild"))
      const AddRoleButton = dynamic(() => import("components/[guild]/AddRoleButton"))
      const AddRewardButton = dynamic(
        () => import("components/[guild]/AddRewardButton")
      )
      const MembersExporter = dynamic(
        () => import("components/[guild]/Members/components/MembersExporter")
      )
      setDynamicEditGuildButton(EditGuildButton)
      setDynamicAddRoleButton(AddRoleButton)
      setDynamicAddRewardButton(AddRewardButton)
      setDynamicMembersExporter(MembersExporter)

      if (!onboardingComplete) {
        const Onboarding = dynamic(() => import("components/[guild]/Onboarding"))
        setDynamicOnboarding(Onboarding)
      }
    } else {
      setDynamicEditGuildButton(null)
      setDynamicAddRoleButton(null)
    }
  }, [isAdmin])

  // not importing it dinamically because that way the whole page flashes once when it loads
  const DynamicOnboardingProvider = DynamicOnboarding
    ? OnboardingProvider
    : React.Fragment

  const showOnboarding = DynamicOnboarding && !onboardingComplete
  const showAccessHub = (isMember || isAdmin) && !showOnboarding

  return (
    <DynamicOnboardingProvider>
      <Layout
        title={name}
        textColor={textColor}
        description={description}
        showLayoutDescription
        image={
          <GuildLogo
            imageUrl={imageUrl}
            size={guildLogoSize}
            iconSize={guildLogoIconSize}
            mt={{ base: 1, lg: 2 }}
            bgColor={textColor === "primary.800" ? "primary.800" : "transparent"}
          />
        }
        background={localThemeColor}
        backgroundImage={localBackgroundImage}
        action={DynamicEditGuildButton && <DynamicEditGuildButton />}
      >
        {DynamicOnboarding && <DynamicOnboarding />}

        {!showOnboarding && (
          <Tabs tabTitle={showAccessHub ? "Home" : "Roles"}>
            {isOwner || isMember ? (
              isAdmin ? (
                DynamicAddRewardButton && <DynamicAddRewardButton />
              ) : (
                <LeaveButton />
              )
            ) : (
              <JoinButton />
            )}
          </Tabs>
        )}

        <Collapse in={showAccessHub} unmountOnExit>
          <AccessHub />
        </Collapse>

        <Section
          title={(showAccessHub || showOnboarding) && "Roles"}
          titleRightElement={
            (showAccessHub || showOnboarding) &&
            DynamicAddRoleButton && (
              <Box
                my="calc(var(--chakra-space-2) * -1) !important"
                ml="auto !important"
              >
                <DynamicAddRoleButton />
              </Box>
            )
          }
          spacing={4}
          mb="12"
        >
          {sortedRoles?.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </Section>

        {(showMembers || isAdmin) && (
          <Section
            title="Members"
            titleRightElement={
              <HStack justifyContent="space-between" w="full">
                <Tag size="sm" maxH={6} pt={1}>
                  {isLoading ? (
                    <Spinner size="xs" />
                  ) : (
                    members?.filter((address) => !!address)?.length ?? 0
                  )}
                </Tag>
                {DynamicMembersExporter && <DynamicMembersExporter />}
              </HStack>
            }
          >
            {showMembers ? (
              <Members members={members} />
            ) : (
              <Text>Members are hidden</Text>
            )}
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
  /**
   * Manually triggering mutate on mount because useSWRImmutable doesn't do because
   * of the fallback
   */
  const { mutate } = useSWRConfig()
  useEffect(() => {
    if (!fallback) return
    mutate(Object.keys(fallback)[0])
  }, [])

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
