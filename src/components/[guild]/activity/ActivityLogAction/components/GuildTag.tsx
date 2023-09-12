import { Tag, useColorModeValue } from "@chakra-ui/react"
import { useActivityLog } from "../../ActivityLogContext"

type Props = {
  guildId: number
}

const GuildTag = ({ guildId }: Props): JSX.Element => {
  const tagColorScheme = useColorModeValue("alpha", "blackalpha")

  const { data } = useActivityLog()
  const name =
    data.values.guilds.find((guild) => guild.id === guildId)?.name ?? "Unknown guild"

  return (
    <Tag colorScheme={tagColorScheme} minW="max-content" h="max-content">
      {name}
    </Tag>
  )
}

export default GuildTag
