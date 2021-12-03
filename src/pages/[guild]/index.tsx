import { Divider, HStack, Stack, Tag, Text, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import EditButtonGroup from "components/common/EditButtonGroup"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import CustomizationButton from "components/[guild]/CustomizationButton"
import DeleteButton from "components/[guild]/DeleteButton"
import useGuildWithSortedRoles from "components/[guild]/hooks/useGuildWithSortedRoles"
import RolesByPlatform from "components/[guild]/RolesByPlatform"
import RoleListItem from "components/[guild]/RolesByPlatform/components/RoleListItem"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useIsOwner from "components/[role]/hooks/useIsOwner"
import LogicDivider from "components/[role]/LogicDivider"
import Members from "components/[role]/Members"
import RequirementCard from "components/[role]/RequirementCard"
import useGuildMembers from "hooks/useGuildMembers"
import { GetStaticPaths, GetStaticProps } from "next"
import React, { useMemo } from "react"
import { SWRConfig } from "swr"
import guilds from "temporaryData/guilds"
import { Guild, PlatformName } from "temporaryData/types"
import fetcher from "utils/fetcher"

const GuildPage = (): JSX.Element => {
  const { name, description, imageUrl, roles, sortedRoles } =
    useGuildWithSortedRoles()

  const { account } = useWeb3React()
  const isOwner = useIsOwner(account)
  const members = useGuildMembers(roles)
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

  const singleRole = useMemo(() => roles?.length === 1, [roles])

  return (
    <Layout
      title={name}
      textColor={textColor}
      description={description}
      showLayoutDescription
      imageUrl={imageUrl}
      imageBg={textColor === "primary.800" ? "primary.800" : "transparent"}
      action={
        <HStack spacing={2}>
          {isOwner && (
            <>
              <CustomizationButton />
              <EditButtonGroup />
              <DeleteButton />
            </>
          )}
        </HStack>
      }
      background={localThemeColor}
      backgroundImage={localBackgroundImage}
    >
      <Stack position="relative" spacing="12">
        {singleRole ? (
          <VStack width="full" alignItems="start" spacing={{ base: 5, sm: 6 }}>
            <RolesByPlatform
              key={roles[0]?.role?.rolePlatforms?.[0]?.platformId}
              platformType={roles[0]?.role?.rolePlatforms?.[0]?.platform?.name}
              platformName={roles[0]?.role?.rolePlatforms?.[0]?.serverName}
              roleIds={[roles[0]?.role?.id]}
            />
            <VStack width="full" maxW="md">
              {roles[0]?.role?.requirements?.map((requirement, i) => (
                <React.Fragment key={i}>
                  <RequirementCard requirement={requirement} />
                  {i < roles[0].role.requirements.length - 1 && (
                    <LogicDivider logic={roles[0].role.logic} />
                  )}
                </React.Fragment>
              ))}
            </VStack>
          </VStack>
        ) : (
          <VStack spacing={{ base: 5, sm: 6 }}>
            {Object.keys(sortedRoles).map((platform: PlatformName) => (
              <React.Fragment key={platform}>
                {Object.entries(sortedRoles[platform]).map(
                  ([platformId, platformRoles]) => (
                    <RolesByPlatform
                      key={platformId}
                      platformType={platform}
                      platformName={
                        platformRoles?.[0]?.rolePlatforms?.[0].serverName
                      }
                      roleIds={platformRoles?.map((role) => role.id)}
                    >
                      <VStack px={{ base: 5, sm: 6 }} py={3} divider={<Divider />}>
                        {platformRoles?.map((role) => (
                          <RoleListItem key={role.id} roleData={role} />
                        ))}
                      </VStack>
                    </RolesByPlatform>
                  )
                )}
              </React.Fragment>
            ))}
          </VStack>
        )}
        <Section
          title={
            <HStack spacing={2} alignItems="center">
              <Text as="span">Members</Text>
              <Tag size="sm">
                {members?.filter((address) => !!address)?.length ?? 0}
              </Tag>
            </HStack>
          }
        >
          <Members members={members} fallbackText="This guild has no members yet" />
        </Section>
      </Stack>
    </Layout>
  )
}

type Props = {
  fallback: Guild
}

const GuildPageWrapper = ({ fallback }: Props): JSX.Element => (
  <SWRConfig value={{ fallback }}>
    <ThemeProvider>
      <GuildPage />
    </ThemeProvider>
  </SWRConfig>
)

const DEBUG = false

const getStaticProps: GetStaticProps = async ({ params }) => {
  const localData = guilds.find((i) => i.urlName === params.guild?.toString())
  const endpoint = `/guild/urlName/${params.guild?.toString()}`

  const data =
    DEBUG && process.env.NODE_ENV !== "production"
      ? localData
      : await fetcher(endpoint)

  if (data.errors) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      fallback: {
        [endpoint]: data,
      },
    },
    revalidate: 10,
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  const mapToPaths = (_: Guild[]) =>
    Array.isArray(_) ? _.map(({ urlName: guild }) => ({ params: { guild } })) : []

  const pathsFromLocalData = mapToPaths(guilds)

  const paths =
    DEBUG && process.env.NODE_ENV !== "production"
      ? pathsFromLocalData
      : await fetcher(`/guild`).then(mapToPaths)

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }

export default GuildPageWrapper
