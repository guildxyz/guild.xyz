import { Text } from "@chakra-ui/react"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useServerData from "hooks/useServerData"
import { useEffect, useMemo } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import pluralize from "utils/pluralize"

const DiscordLabel = () => {
  const { index, guildPlatform, platformRoleId } = useRolePlatform()

  const {
    data: { categories },
  } = useServerData(guildPlatform.platformGuildId)

  const gatedChannels = useWatch({
    name: `rolePlatforms.${index}.platformRoleData.gatedChannels`,
    defaultValue: {},
  })

  const numOfGatedChannels = useMemo(
    () =>
      Object.values(gatedChannels ?? {})
        .flatMap(
          ({ channels }) =>
            Object.values(channels ?? {}).map(({ isChecked }) => +isChecked) ?? []
        )
        .reduce((acc, curr) => acc + curr, 0),
    [gatedChannels]
  )

  const { setValue } = useFormContext()
  const { touchedFields } = useFormState()

  useEffect(() => {
    if (!categories || categories.length <= 0) return

    setValue(
      `rolePlatforms.${index}.platformRoleData.gatedChannels`,
      Object.fromEntries(
        categories.map(({ channels, id, name }) => [
          id,
          {
            name,
            channels: Object.fromEntries(
              (channels ?? []).map((channel) => [
                channel.id,
                {
                  name: channel.name,
                  isChecked: touchedFields.gatedChannels?.[id]?.channels?.[
                    channel.id
                  ]
                    ? gatedChannels?.[id]?.channels?.[channel.id]?.isChecked
                    : channel.roles.includes(platformRoleId),
                },
              ])
            ),
          },
        ])
      )
    )
  }, [categories, platformRoleId])

  return <Text>{pluralize(numOfGatedChannels, "gated channel")}</Text>
}

export default DiscordLabel
