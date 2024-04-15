import { Box, Center, Flex, Heading, HStack, Spinner } from "@chakra-ui/react"
import AccessHub from "components/[guild]/AccessHub"
import { useAccessedGuildPlatforms } from "components/[guild]/AccessHub/AccessHub"
import GuildImageAndName from "components/[guild]/collect/components/GuildImageAndName"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useRoleGroup from "components/[guild]/hooks/useRoleGroup"
import JoinButton from "components/[guild]/JoinButton"
import JoinModalProvider from "components/[guild]/JoinModal/JoinModalProvider"
import LeaveButton from "components/[guild]/LeaveButton"
import Roles from "components/[guild]/Roles"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import Section from "components/common/Section"
import useMembership from "components/explorer/hooks/useMembership"
import { GetStaticPaths, GetStaticProps } from "next"
import dynamic from "next/dynamic"
import Head from "next/head"
import { MintPolygonIDProofProvider } from "platforms/PolygonID/components/MintPolygonIDProofProvider"
import { useState } from "react"
import { SWRConfig } from "swr"
import { Guild } from "types"
import fetcher from "utils/fetcher"
import parseDescription from "utils/parseDescription"

const DynamicEditCampaignButton = dynamic(
  () => import("components/[guild]/[group]/EditCampaignButton")
)
const DynamicAddAndOrderRoles = dynamic(
  () => import("components/[guild]/AddAndOrderRoles")
)
const DynamicAddRewardButton = dynamic(
  () => import("components/[guild]/AddRewardButton")
)
const DynamicRecheckAccessesButton = dynamic(() =>
  import("components/[guild]/RecheckAccessesButton").then(
    (module) => module.TopRecheckAccessesButton
  )
)

const GroupPage = (): JSX.Element => {
  const { imageUrl: guildImageUrl } = useGuild()

  const group = useRoleGroup()

  const { isAdmin } = useGuildPermission()
  const { isMember } = useMembership()

  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()
  const [isAddRoleStuck, setIsAddRoleStuck] = useState(false)

  const accessedGuildPlatforms = useAccessedGuildPlatforms(group.id)

  return (
    <>
      <Head>
        <meta name="theme-color" content={localThemeColor} />
      </Head>

      <Layout
        backButton={<GuildImageAndName />}
        action={isAdmin && <DynamicEditCampaignButton />}
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
        backgroundOffset={100}
      >
        <Flex justifyContent="end" mb={3}>
          <HStack>
            {isMember && !isAdmin && <DynamicRecheckAccessesButton />}
            {!isMember ? (
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
