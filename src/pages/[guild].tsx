import { SimpleGrid } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import { GuildProvider } from "components/[guild]/Context"
import JoinButton from "components/[guild]/JoinButton"
import RequirementCard from "components/[guild]/RequirementCard"
import { GetStaticPaths, GetStaticProps } from "next"
import guilds from "temporaryData/guilds"
import { Guild } from "temporaryData/types"
import kebabToCamelCase from "utils/kebabToCamelCase"

type Props = {
  guildData: Guild
}

const GuildPage = ({ guildData }: Props): JSX.Element => {
  const hashtag = `${kebabToCamelCase(guildData.urlName)}Guild`

  return (
    <GuildProvider data={guildData}>
      <Layout
        title={guildData.name}
        // subTitle="123 members joined"
        action={guildData.communityPlatforms[0] && <JoinButton />}
      >
        <Section title="Requirements">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, md: 6 }}>
            {guildData.levels?.[0]?.requirements?.map((requirement, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <RequirementCard key={i} requirement={requirement} />
            ))}
          </SimpleGrid>
        </Section>

        {/* <Section title={`Use the #${hashtag} hashtag!`}>
            <TwitterFeed hashtag={`${hashtag}`} />
          </Section> */}

        {/* <GridItem mt={{ base: 0, md: 8 }} colSpan={{ base: 1, md: 2 }}>
            <Section title={`${guildData.name} members`}>
              <SimpleGrid
                columns={{ base: 2, sm: 3, md: 4, lg: 6, xl: 8 }}
                gap={{ base: 5, md: 6 }}
              >
                <VStack spacing={2}>
                  <Img
                    src="https://avatars.githubusercontent.com/u/53289941?s=48&v=4"
                    rounded="full"
                  />
                  <Text fontFamily="display" fontWeight="semibold" fontSize="sm">
                    Member name
                  </Text>
                </VStack>
              </SimpleGrid>
            </Section>
          </GridItem> */}
      </Layout>
    </GuildProvider>
  )
}

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
            ? response.json().then((data) => (data.isGuild ? data : localData))
            : localData
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
export default GuildPage
