import { Checkbox } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { useController, useWatch } from "react-hook-form"
import { PlatformType } from "types"

type Props = {
  categoryId: string
  channelId: string
  isGuarded: boolean
}

const Channel = ({ categoryId, channelId, isGuarded }: Props) => {
  const { guildPlatforms } = useGuild()

  // TODO: maybe we could just pass the discordRolePlatformIndex as a prop to this component?...
  const rolePlatforms = useWatch({ name: "rolePlatforms" })
  const discordGuildPlatformId = guildPlatforms?.find(
    (p) => p.platformId === PlatformType.DISCORD
  )?.id
  const discordRolePlatformIndex = rolePlatforms
    .map((p) => p.guildPlatformId)
    .indexOf(discordGuildPlatformId)

  const {
    field: { name: fieldName, onBlur, onChange, ref },
  } = useController({
    name: `rolePlatforms.${discordRolePlatformIndex}.platformRoleData.gatedChannels.${categoryId}.channels.${channelId}`,
  })

  const isChecked = useWatch({
    name: `rolePlatforms.${discordRolePlatformIndex}.platformRoleData.gatedChannels.${categoryId}.channels.${channelId}.isChecked`,
  })

  const name = useWatch({
    name: `rolePlatforms.${discordRolePlatformIndex}.platformRoleData.gatedChannels.${categoryId}.channels.${channelId}.name`,
  })

  return (
    <Checkbox
      name={fieldName}
      ref={ref}
      onBlur={onBlur}
      isChecked={isGuarded || isChecked}
      isDisabled={isGuarded}
      onChange={(e) => onChange({ name, isChecked: e.target.checked })}
    >
      {name}
    </Checkbox>
  )
}

export default Channel
