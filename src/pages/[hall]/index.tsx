import { Divider, HStack, Stack, Tag, Text, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import LogicDivider from "components/[guild]/LogicDivider"
import Members from "components/[guild]/Members"
import RequirementCard from "components/[guild]/RequirementCard"
import CustomizationButton from "components/[hall]/CustomizationButton"
import DeleteButton from "components/[hall]/DeleteButton"
import GuildsByPlatform from "components/[hall]/GuildsByPlatform"
import GuildListItem from "components/[hall]/GuildsByPlatform/components/GuildListItem"
import useHallWithSortedGuilds from "components/[hall]/hooks/useHallWithSortedGuilds"
import { ThemeProvider, useThemeContext } from "components/[hall]/ThemeContext"
import useHallMembers from "hooks/useHallMembers"
import { GetStaticPaths, GetStaticProps } from "next"
import React, { useMemo } from "react"
import { SWRConfig } from "swr"
import halls from "temporaryData/halls"
import { Hall, PlatformName } from "temporaryData/types"
import fetchApi from "utils/fetchApi"

const HallPage = (): JSX.Element => {
  const { name, description, imageUrl, guilds, sortedGuilds } =
    useHallWithSortedGuilds()

  const { account } = useWeb3React()
  const isOwner = useIsOwner(account)
  const members = useHallMembers(guilds)
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

  const singleGuild = useMemo(() => guilds?.length === 1, [guilds])

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
              {/* <EditButtonGroup /> */}
              <DeleteButton />
            </>
          )}
        </HStack>
      }
      background={localThemeColor}
      backgroundImage={localBackgroundImage}
    >
      <Stack position="relative" spacing="12">
        {singleGuild ? (
          <VStack width="full" alignItems="start" spacing={{ base: 5, sm: 6 }}>
            <GuildsByPlatform
              key={guilds[0]?.guild?.guildPlatforms?.[0]?.platformId}
              platformType={guilds[0]?.guild?.guildPlatforms?.[0]?.name}
              platformName={guilds[0]?.guild?.guildPlatforms?.[0]?.serverName}
              guildIds={[guilds[0]?.guild?.id]}
            />
            <VStack width="full" maxW="md">
              {guilds[0]?.guild?.requirements?.map((requirement, i) => (
                <React.Fragment key={i}>
                  <RequirementCard requirement={requirement} />
                  {i < guilds[0].guild.requirements.length - 1 && (
                    <LogicDivider logic={guilds[0].guild.logic} />
                  )}
                </React.Fragment>
              ))}
            </VStack>
          </VStack>
        ) : (
          <VStack spacing={{ base: 5, sm: 6 }}>
            {Object.keys(sortedGuilds).map((platform: PlatformName) => (
              <React.Fragment key={platform}>
                {Object.entries(sortedGuilds[platform]).map(
                  ([platformId, platformGuilds]) => (
                    <GuildsByPlatform
                      key={platformId}
                      platformType={platform}
                      platformName={
                        platformGuilds?.[0]?.guildPlatforms?.[0].serverName
                      }
                      guildIds={platformGuilds?.map((guild) => guild.id)}
                    >
                      <VStack px={{ base: 5, sm: 6 }} py={3} divider={<Divider />}>
                        {platformGuilds?.map((guild) => (
                          <GuildListItem key={guild.id} guildData={guild} />
                        ))}
                      </VStack>
                    </GuildsByPlatform>
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
          <Members members={members} fallbackText="This hall has no members yet" />
        </Section>
      </Stack>
    </Layout>
  )
}

type Props = {
  fallback: Hall
}

const HallPageWrapper = ({ fallback }: Props): JSX.Element => (
  <SWRConfig value={{ fallback }}>
    <ThemeProvider>
      <HallPage />
    </ThemeProvider>
  </SWRConfig>
)

const DEBUG = false

const getStaticProps: GetStaticProps = async ({ params }) => {
  const localData = halls.find((i) => i.urlName === params.hall)
  const endpoint = `/group/urlName/${params.hall?.toString()}`

  const data =
    DEBUG && process.env.NODE_ENV !== "production"
      ? localData
      : await fetchApi(endpoint)

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
  const mapToPaths = (_: Hall[]) =>
    Array.isArray(_) ? _.map(({ urlName: hall }) => ({ params: { hall } })) : []

  const pathsFromLocalData = mapToPaths(halls)

  const paths =
    DEBUG && process.env.NODE_ENV !== "production"
      ? pathsFromLocalData
      : await fetchApi(`/group`).then(mapToPaths)

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }

export default HallPageWrapper
