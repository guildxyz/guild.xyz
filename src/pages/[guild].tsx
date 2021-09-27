import { HStack, SimpleGrid, Stack, Tag, Text, VStack } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import { GuildProvider, useGuild } from "components/[guild]/Context"
import DeleteButton from "components/[guild]/DeleteButton"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import JoinButton from "components/[guild]/JoinButton"
import LogicDivider from "components/[guild]/LogicDivider"
import Members from "components/[guild]/Members"
import useMembers from "components/[guild]/Members/hooks/useMembers"
import RequirementCard from "components/[guild]/RequirementCard"
import { GetStaticPaths, GetStaticProps } from "next"
import guilds from "temporaryData/guilds"
import { Guild } from "temporaryData/types"
import kebabToCamelCase from "utils/kebabToCamelCase"

const GuildPageContent = (): JSX.Element => {
  const { urlName, name, communityPlatforms, levels, imageUrl } = useGuild()
  const hashtag = `${kebabToCamelCase(urlName)}Guild`
  const isOwner = useIsOwner()
  const members = useMembers()

  return (
    <Layout
      title={name}
      action={
        <HStack spacing={2}>
          {communityPlatforms[0] && <JoinButton />}
          {isOwner && <DeleteButton />}
        </HStack>
      }
      imageUrl={imageUrl}
    >
      <Stack spacing="12">
        <Section title="Requirements">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, md: 6 }}>
            <VStack>
              {levels?.[0]?.requirements?.map((requirement, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <>
                  <RequirementCard key={i} requirement={requirement} />
                  {i < levels[0].requirements.length - 1 && (
                    <LogicDivider logic={levels[0].logic} />
                  )}
                </>
              ))}
            </VStack>
          </SimpleGrid>
        </Section>
        {/* <Section title={`Use the #${hashtag} hashtag!`}>
              <TwitterFeed hashtag={`${hashtag}`} />
            </Section> */}
        <Section
          title={
            <HStack spacing={2} alignItems="end">
              <Text as="span">Members</Text>
              <Tag size="sm">
                {members?.filter((address) => !!address)?.length ?? 0}
              </Tag>
            </HStack>
          }
        >
          <Members />
        </Section>
      </Stack>
    </Layout>
  )
}

type Props = {
  guildData: Guild
}

const GuildPageWrapper = ({ guildData }: Props): JSX.Element => (
  <GuildProvider data={guildData}>
    <GuildPageContent />
  </GuildProvider>
)

const DEBUG = false

const getStaticProps: GetStaticProps = async ({ params }) => {
  const localData = guilds.find((i) => i.urlName === params.guild)

  const guildData =
    DEBUG && process.env.NODE_ENV !== "production"
      ? localData
      : await fetch(
          `${process.env.NEXT_PUBLIC_API}/community/urlName/${params.guild}`
        ).then((response: Response) =>
          response.ok
            ? response.json().then((data) => (data.isGuild ? data : undefined))
            : undefined
        )

  if (!guildData) {
    return {
      notFound: true,
    }
  }

  return {
    props: { guildData },
    revalidate: 10,
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  const mapToPaths = (_: Guild[]) =>
    _.map(({ urlName: guild }) => ({ params: { guild } }))

  const pathsFromLocalData = mapToPaths(guilds)

  const paths =
    DEBUG && process.env.NODE_ENV !== "production"
      ? pathsFromLocalData
      : await fetch(`${process.env.NEXT_PUBLIC_API}/community/guilds/all`).then(
          (response) =>
            response.ok ? response.json().then(mapToPaths) : pathsFromLocalData
        )

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }
export default GuildPageWrapper
