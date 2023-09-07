import { Tag, useColorModeValue } from "@chakra-ui/react"
import { useActivityLog } from "../../ActivityLogContext"

type Props = {
  id: number
}

const GuildTag = ({ id }: Props): JSX.Element => {
  const tagColorScheme = useColorModeValue("alpha", "blackalpha")

  const { data } = useActivityLog()
  const name =
    data.values.guilds.find((guild) => guild.id === id)?.name ?? "Unknown guild"

  return (
    <Tag colorScheme={tagColorScheme} minW="max-content" h="max-content">
      {name}
    </Tag>
  )
}

export default GuildTag
