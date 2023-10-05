import {
  Box,
  Center,
  Collapse,
  Flex,
  Heading,
  HStack,
  Spinner,
  Stack,
} from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import Link from "components/common/Link"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import Section from "components/common/Section"
import AccessHub from "components/[guild]/AccessHub"
import CollapsibleRoleSection from "components/[guild]/CollapsibleRoleSection"
import useAccess from "components/[guild]/hooks/useAccess"
import useAutoStatusUpdate from "components/[guild]/hooks/useAutoStatusUpdate"
import useGroup from "components/[guild]/hooks/useGroup"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useIsMember from "components/[guild]/hooks/useIsMember"
import JoinButton from "components/[guild]/JoinButton"
import JoinModalProvider from "components/[guild]/JoinModal/JoinModalProvider"
import LeaveButton from "components/[guild]/LeaveButton"
import { RequirementErrorConfigProvider } from "components/[guild]/Requirements/RequirementErrorConfigContext"
import RoleCard from "components/[guild]/RoleCard/RoleCard"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useScrollEffect from "hooks/useScrollEffect"
import { GetStaticPaths, GetStaticProps } from "next"
import dynamic from "next/dynamic"
import Head from "next/head"
import { useMemo, useRef, useState } from "react"
import { SWRConfig } from "swr"
import { Guild, PlatformType, Visibility } from "types"
import fetcher from "utils/fetcher"
import parseDescription from "utils/parseDescription"

const BATCH_SIZE = 10

const DynamicAddAndOrderRoles = dynamic(
  () => import("components/[guild]/AddAndOrderRoles")
)
const DynamicAddRewardButton = dynamic(
  () => import("components/[guild]/AddRewardButton")
)
const DynamicResendRewardButton = dynamic(
  () => import("components/[guild]/ResendRewardButton")
)
const DynamicNoRolesAlert = dynamic(() => import("components/[guild]/NoRolesAlert"))

const GroupPage = (): JSX.Element => {
  const {
    roles,
    guildPlatforms,
    name: guildName,
    urlName: guildUrlName,
    imageUrl: guildImageUrl,
  } = useGuild()

  useAutoStatusUpdate()

  const group = useGroup()
  const groupRoles = roles?.filter((role) => role.groupId === group.id)

  // temporary, will order roles already in the SQL query in the future
  const sortedRoles = useMemo(() => {
    if (groupRoles?.every((role) => role.position === null)) {
      const byMembers = groupRoles?.sort(
        (role1, role2) => role2.memberCount - role1.memberCount
      )
      return byMembers
    }

    return (
      groupRoles?.sort((role1, role2) => {
        if (role1.position === null) return 1
        if (role2.position === null) return -1
        return role1.position - role2.position
      }) ?? []
    )
  }, [groupRoles])

  const publicRoles = sortedRoles.filter(
    (role) => role.visibility !== Visibility.HIDDEN
  )
  const hiddenRoles = sortedRoles.filter(
    (role) => role.visibility === Visibility.HIDDEN
  )

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

  const renderedRoles = publicRoles?.slice(0, renderedRolesCount) || []

  const { isAdmin } = useGuildPermission()
  const isMember = useIsMember()
  const { hasAccess } = useAccess()

  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()
  const [isAddRoleStuck, setIsAddRoleStuck] = useState(false)

  // TODO: show only the relevant rewards in the access hub!
  const showAccessHub =
    guildPlatforms?.some(
      (guildPlatform) => guildPlatform.platformId === PlatformType.CONTRACT_CALL
    ) ||
    isMember ||
    isAdmin

  return (
    <>
      <Head>
        <meta name="theme-color" content={localThemeColor} />
      </Head>

      <Layout
        beforeHeaderElement={
          <HStack mb={3}>
            <GuildLogo imageUrl={guildImageUrl} size={8} />
            <Link
              href={`/${guildUrlName}`}
              fontFamily="display"
              fontWeight="bold"
              color={textColor}
            >
              {guildName}
            </Link>
          </HStack>
        }
        title={group.name}
        textColor={textColor}
        ogDescription={group.description}
        description={group.description && parseDescription(group.description)}
        image={
          group.imageUrl && (
            <GuildLogo
              imageUrl={group.imageUrl}
              size={{ base: "56px", lg: "72px" }}
              mt={{ base: 1, lg: 2 }}
              bgColor={textColor === "primary.800" ? "primary.800" : "transparent"}
            />
          )
        }
        imageUrl={group.imageUrl ?? guildImageUrl}
        background={localThemeColor}
        backgroundImage={localBackgroundImage}
      >
        <Flex justifyContent="end" mb={3}>
          <HStack>
            {isMember && !isAdmin && <DynamicResendRewardButton />}
            {!isMember && (isAdmin ? hasAccess : true) ? (
              <JoinButton />
            ) : !isAdmin ? (
              <LeaveButton />
            ) : isAddRoleStuck ? (
              <DynamicAddAndOrderRoles />
            ) : (
              <DynamicAddRewardButton />
            )}
          </HStack>
        </Flex>
        <Collapse in={showAccessHub} unmountOnExit>
          <AccessHub />
        </Collapse>
        <Section
          title={showAccessHub && "Roles"}
          titleRightElement={
            isAdmin &&
            showAccessHub && (
              <Box my="-2 !important" ml="auto !important">
                {/* TODO: I think we can't order roles inside a group (yet?) We must double check that! */}
                <DynamicAddAndOrderRoles setIsStuck={setIsAddRoleStuck} />
              </Box>
            )
          }
          mb="10"
        >
          {renderedRoles.length ? (
            <RequirementErrorConfigProvider>
              <Stack ref={rolesEl} spacing={4}>
                {renderedRoles.map((role) => (
                  <RoleCard key={role.id} role={role} />
                ))}
              </Stack>
            </RequirementErrorConfigProvider>
          ) : (
            <DynamicNoRolesAlert type="GROUP" />
          )}

          {roles?.length > renderedRolesCount && (
            <Center pt={6}>
              <Spinner />
            </Center>
          )}

          {!!hiddenRoles?.length && (
            <CollapsibleRoleSection
              id="hiddenRoles"
              roleCount={hiddenRoles.length}
              label="hidden"
              defaultIsOpen
            >
              {hiddenRoles.map((role) => (
                <RoleCard key={role.id} role={role} />
              ))}
            </CollapsibleRoleSection>
          )}
        </Section>
      </Layout>
    </>
  )
}

type Props = {
  fallback: { string: Guild }
}

const GroupPageWrapper = ({ fallback }: Props): JSX.Element => {
  const guild = useGuild()

  const group = useGroup()

  if (!fallback || !guild.id || !group.id) {
    return (
      <Center h="100vh" w="screen">
        <Spinner />
        <Heading fontFamily={"display"} size="md" ml="4" mb="1">
          Loading guild...
        </Heading>
      </Center>
    )
  }

  return (
    <>
      <LinkPreviewHead
        path={fallback ? Object.values(fallback)[0].urlName : guild.urlName}
      />
      <Head>
        <title>{group.name}</title>
        <meta property="og:title" content={group.name} />
      </Head>
      <SWRConfig value={fallback && { fallback }}>
        <ThemeProvider>
          <JoinModalProvider>
            <GroupPage />
          </JoinModalProvider>
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
      ? _.map(({ urlName: guild, groups }) =>
          groups?.map(({ id }) => ({
            params: { guild, group: id.toString() },
          }))
        )
          .flat()
          .filter(Boolean)
      : []

  const paths = await fetcher(`/v2/guilds`).then(mapToPaths)

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }

export default GroupPageWrapper
