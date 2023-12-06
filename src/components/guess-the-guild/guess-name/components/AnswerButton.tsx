import Button from "components/common/Button"
import { GuildBase } from "types"

type Props = {
  guild: GuildBase
  selectedGuildId?: number
  solutionGuild: GuildBase
  isAnswerSubmitted: boolean
  onSelect: (guildId: number) => void
}

const AnswerButton = ({
  guild,
  selectedGuildId,
  solutionGuild,
  isAnswerSubmitted,
  onSelect,
}: Props) => {
  let colorScheme = "gray"
  let isDisabled = false
  let variant = "solid"
  let isActive = false

  if (isAnswerSubmitted) {
    if (guild.id === selectedGuildId) {
      colorScheme = solutionGuild.id === selectedGuildId ? "green" : "red"
    } else if (guild.id === solutionGuild.id) {
      colorScheme = "green"
      variant = "outline"
    } else {
      isDisabled = true
      colorScheme = "gray"
      variant = "solid"
    }
  } else {
    isActive = selectedGuildId === guild.id
  }

  const handleClick = (guildId: number) => {
    if (isAnswerSubmitted) return
    onSelect(guildId)
  }

  return (
    <Button
      key={guild.id}
      w="100%"
      colorScheme={colorScheme}
      isDisabled={isDisabled}
      variant={variant}
      isActive={isActive}
      onClick={() => handleClick(guild.id)}
    >
      {guild.name}
    </Button>
  )
}

export default AnswerButton
