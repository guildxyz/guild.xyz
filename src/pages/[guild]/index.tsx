import Layout from "components/common/Layout"
import { Guild, guilds } from "temporaryData/guilds"

type Props = {
  guildData: Guild
}

const GuildPage = ({ guildData }: Props): JSX.Element => {
  return (
    <Layout title={guildData.name}>
      {guildData.name}
    </Layout>
  )
}

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
