import { Button, SimpleGrid, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import RequirementCard from "components/[guild]/RequirementCard"
import TwitterFeed from "components/[guild]/TwitterFeed"
import guilds from "temporaryData/guilds"
import { Guild } from "temporaryData/types"

type Props = {
  guildData: Guild
}

const GuildPage = ({ guildData }: Props): JSX.Element => {
  const { account } = useWeb3React()

  return (
    <Layout
      title={guildData.name}
      subTitle="123 members joined"
      action={
        account && (
          <Button rounded="2xl" colorScheme="green">
            Join guild
          </Button>
        )
      }
    >
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, md: 6 }}>
        <Section title="Requirements">
          <VStack spacing={{ base: 5, md: 6 }}>
            {guildData.levels[0].requirements.map((requirement, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <RequirementCard key={i} requirement={requirement} />
            ))}
          </VStack>
        </Section>

        <Section title="Use the #asd123 hashtag!">
          <TwitterFeed hashTag="#asd123" />
        </Section>
      </SimpleGrid>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const { guild: guildUrlName } = params

  const guildData = guilds.find((guild) => guild.urlName === guildUrlName)

  return {
    props: {
      guildData,
    },
  }
}

export async function getStaticPaths() {
  const mapToPaths = (_) => _.map(({ urlName: guild }) => ({ params: { guild } }))

  const paths = mapToPaths(guilds)
  return {
    paths,
    fallback: "blocking",
  }
}

export default GuildPage
