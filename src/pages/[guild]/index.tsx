import { Button, VStack } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import RequirementCard from "components/[guild]/RequirementCard"
import { Guild, guilds } from "temporaryData/guilds"

type Props = {
  guildData: Guild
}

const GuildPage = ({ guildData }: Props): JSX.Element => (
  <Layout
    title={guildData.name}
    action={
      <Button rounded="2xl" colorScheme="green">
        Join guild
      </Button>
    }
  >
    <Section title="Requirements">
      <VStack maxWidth="sm" spacing={{ base: 5, md: 6 }}>
        {guildData.requirements.map((requirement, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <RequirementCard key={i} requirement={requirement} />
        ))}
      </VStack>
    </Section>
  </Layout>
)

export async function getServerSideProps({ params }) {
  const { guild: guildUrlName } = params

  const guildData = guilds.find((guild) => guild.urlName === guildUrlName)

  return {
    props: {
      guildData,
    },
  }
}

export default GuildPage
