import { Text } from "@chakra-ui/react"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useDCAuth from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuth"
import useServerData from "hooks/useServerData"
import { useEffect, useMemo } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import pluralize from "utils/pluralize"
import { GatedChannels } from "./ChannelsToGate/components/Category"

const BaseLabel = ({ isAdded = false }: { isAdded?: boolean }) => {
  const { nativePlatformId, discordRoleId: formDiscordRoleId } = useRolePlatform()
  const { authorization } = useDCAuth("guilds")
  const roleType = useWatch({ name: "roleType" })

  const {
    data: { roles },
  } = useServerData(nativePlatformId)

  const rolesById = useMemo(
    () => Object.fromEntries(roles.map((role) => [role.id, role])),
    [roles]
  )

  const discordRoleId = useWatch({
    name: "discordRoleId",
    defaultValue: formDiscordRoleId,
  })

  const {
    data: { categories },
  } = useServerData(nativePlatformId, { authorization })

  const gatedChannels = useWatch<{ gatedChannels: GatedChannels }>({
    name: "gatedChannels",
    defaultValue: {},
  })

  const numOfGatedChannels = useMemo(
    () =>
      Object.values(gatedChannels)
        .flatMap(
          ({ channels }) =>
            Object.values(channels).map(({ isChecked }) => +isChecked) ?? []
        )
        .reduce((acc, curr) => acc + curr, 0),
    [gatedChannels]
  )

  const { setValue } = useFormContext()
  const { touchedFields } = useFormState()

  useEffect(() => {
    if (!categories || categories.length <= 0) return

    setValue(
      "gatedChannels",
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
                    : channel.roles.includes(discordRoleId),
                },
              ])
            ),
          },
        ])
      )
    )
  }, [categories, discordRoleId])

  return (
    <Text>
      {isAdded &&
        ((roleType === "NEW" && "Create a new role for me, ") ||
          `Guildify the ${
            (!!rolesById?.[discordRoleId]?.name &&
              ` "${rolesById[discordRoleId].name}"`) ||
            ""
          } role, `)}
      {pluralize(numOfGatedChannels, "gated channel")}
    </Text>
  )
}

export default BaseLabel
