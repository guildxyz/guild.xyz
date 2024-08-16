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
import AccessHub from "components/[guild]/AccessHub"
import { GroupPageImageAndName } from "components/[guild]/GroupPageImageAndName"
import { GuildPageBanner } from "components/[guild]/GuildPageBanner"
import { JoinButton } from "components/[guild]/JoinButton"
import JoinModalProvider from "components/[guild]/JoinModal/JoinModalProvider"
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
import { MintPolygonIDProofProvider } from "rewards/PolygonID/components/MintPolygonIDProofProvider"
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
    <>
      <Head>
        <meta name="theme-color" content={localThemeColor} />
      </Head>

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
    </>
  )
}

type Props = {
  fallback: { string: Guild }
}

const GroupPageWrapper = ({ fallback }: Props): JSX.Element => {
  const guild = useGuild()

  const group = useRoleGroup()

  if (!fallback || !guild.id || !group?.id) {
    return (
      <Center h="100vh" w="screen">
        <Spinner />
        <Heading fontFamily={"display"} size="md" ml="4" mb="1">
          Loading page...
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
          <MintPolygonIDProofProvider>
            <JoinModalProvider>
              <GroupPage />
            </JoinModalProvider>
          </MintPolygonIDProofProvider>
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
