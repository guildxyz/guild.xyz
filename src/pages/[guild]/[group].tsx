import { Header } from "@/components/Header"
import {
  Layout,
  LayoutBanner,
  LayoutContainer,
  LayoutHeadline,
  LayoutHero,
  LayoutMain,
} from "@/components/Layout"
import { Center, Heading, Spinner } from "@chakra-ui/react"
import { AccessHub } from "components/[guild]/AccessHub"
import { GroupPageImageAndName } from "components/[guild]/GroupPageImageAndName"
import { GuildPageBanner } from "components/[guild]/GuildPageBanner"
import { JoinButton } from "components/[guild]/JoinButton"
import { JoinModalProvider } from "components/[guild]/JoinModal/JoinModalProvider"
import Roles from "components/[guild]/Roles"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import GuildImageAndName from "components/[guild]/collect/components/GuildImageAndName"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useRoleGroup from "components/[guild]/hooks/useRoleGroup"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import Section from "components/common/Section"
import useMembership from "components/explorer/hooks/useMembership"
import { GetStaticPaths, GetStaticProps } from "next"
import dynamic from "next/dynamic"
import Head from "next/head"
import { SWRConfig } from "swr"
import { Guild } from "types"
import fetcher from "utils/fetcher"
import parseDescription from "utils/parseDescription"

const DynamicAddAndOrderRoles = dynamic(
  () => import("components/[guild]/AddAndOrderRoles"),
  {
    ssr: false,
  }
)
const DynamicAddSolutionsAndEditGuildButton = dynamic(
  () =>
    import("components/[guild]/AddSolutionsAndEditGuildButton").then(
      (module) => module.AddSolutionsAndEditGuildButton
    ),
  {
    ssr: false,
  }
)
const DynamicRecheckAccessesAndLeaveButton = dynamic(
  () =>
    import("components/[guild]/RecheckAccessesAndLeaveButton").then(
      (module) => module.RecheckAccessesAndLeaveButton
    ),
  {
    ssr: false,
  }
)

const GroupPage = (): JSX.Element => {
  const { isDetailed } = useGuild()

  const group = useRoleGroup()

  const { isAdmin } = useGuildPermission()
  const { isMember } = useMembership()

  const { localThemeColor } = useThemeContext()

  return (
    <Layout>
      <LayoutHero className="pb-24">
        <LayoutBanner>
          <GuildPageBanner />
        </LayoutBanner>

        <Header className="mb-10" />

        <LayoutContainer className="-mb-16 mt-6 max-w-screen-xl">
          <GuildImageAndName />
        </LayoutContainer>

        <LayoutHeadline className="max-w-screen-xl pt-12">
          <GroupPageImageAndName />

          <div className="ml-auto">
            {isAdmin && isDetailed ? (
              <DynamicAddSolutionsAndEditGuildButton />
            ) : !isMember ? (
              <JoinButton />
            ) : (
              <DynamicRecheckAccessesAndLeaveButton />
            )}
          </div>
        </LayoutHeadline>

        {group?.description && (
          <LayoutContainer className="mt-6 max-w-screen-xl font-semibold">
            {parseDescription(group.description)}
          </LayoutContainer>
        )}
      </LayoutHero>

      <LayoutMain className="-top-16 flex max-w-screen-xl flex-col items-start gap-8">
        <AccessHub />

        <Section
          titleRightElement={isAdmin ? <DynamicAddAndOrderRoles /> : undefined}
        >
          <Roles />
        </Section>
      </LayoutMain>
    </Layout>
  )
}

type Props = {
  groupUrlName: string
  fallback: { string: Guild }
}

const GroupPageWrapper = ({ groupUrlName, fallback }: Props): JSX.Element => {
  const guild = useGuild()

  if (!fallback && !guild.id) {
    return (
      <Center h="100vh" w="screen">
        <Spinner />
        <Heading fontFamily={"display"} size="md" ml="4" mb="1">
          Loading page...
        </Heading>
      </Center>
    )
  }

  const [fallbackGuild] = Object.values(fallback ?? {})
  const fallbackGroup = fallbackGuild?.groups.find((g) => (g.urlName = groupUrlName))

  return (
    <>
      {fallbackGuild && fallbackGroup && (
        <>
          <LinkPreviewHead path={`${fallbackGuild.urlName}/${groupUrlName}`} />
          <Head>
            <title>{fallbackGroup.name}</title>
            <meta property="og:title" content={fallbackGroup.name} />
            <meta name="theme-color" content={guild.theme?.color} />
          </Head>
        </>
      )}
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
  const endpoint = `/v2/guilds/guild-page/${params?.guild?.toString()}`

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
      groupUrlName: params?.group?.toString(),
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
