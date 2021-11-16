import { Divider, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import { Guild, PlatformName } from "temporaryData/types"
import GuildListItem from "../GuildListItem"
import Platform from "./components/Platform"

type Props = {
  platformName: PlatformName
  platformId: string
  guilds: Array<Guild>
}

const GuildsByPlatform = ({
  platformName,
  platformId,
  guilds,
}: Props): JSX.Element => (
  <Card p={{ base: 5, sm: 6 }} width="full">
    <Platform platformId={platformId} platformName={platformName} />

    <VStack divider={<Divider />}>
      {guilds?.map((guild) => (
        <GuildListItem key={guild.id} guildData={guild} />
      ))}
    </VStack>
  </Card>
)

export default GuildsByPlatform
