import { Button, VStack } from '@chakra-ui/react'
import Layout from "components/common/Layout"
import Section from 'components/common/Section'
import RuleCard from 'components/[guild]/RuleCard'
import { Guild, guilds } from "temporaryData/guilds"

type Props = {
  guildData: Guild
}

const GuildPage = ({ guildData }: Props): JSX.Element => (
  <Layout title={guildData.name} action={<Button rounded="2xl" colorScheme="green">Join guild</Button>}>
    <Section title="Rules">
      <VStack maxWidth="sm" spacing={{ base: 5, md: 6 }}>
      {guildData.rules.map((rule, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <RuleCard key={i} title={rule.text} color={rule.color} />
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
      guildData
    },
  }
}

export default GuildPage
