import { Checkbox, Stack } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { PlatformType } from "types"
import Channel from "./Channel"

type Props = { categoryId: string; isGuarded: boolean }

export type GatedChannels = Record<
  string,
  {
    name: string
    channels: Record<string, { name: string; isChecked: boolean }>
  }
>

const Category = ({ categoryId, isGuarded }: Props) => {
  const { guildPlatforms } = useGuild()
  const { setValue } = useFormContext()

  // TODO: maybe we could just pass the discordRolePlatformIndex as a prop to this component?...
  const rolePlatforms = useWatch({ name: "rolePlatforms" })
  const discordGuildPlatformId = guildPlatforms?.find(
    (p) => p.platformId === PlatformType.DISCORD
  )?.id
  const discordRolePlatformIndex = rolePlatforms
    .map((p) => p.guildPlatformId)
    .indexOf(discordGuildPlatformId)

  // TODO: typing
  const name = useWatch({
    name: `rolePlatforms.${discordRolePlatformIndex}.platformRoleData.gatedChannels.${categoryId}.name`,
  })

  const channels = useWatch({
    name: `rolePlatforms.${discordRolePlatformIndex}.platformRoleData.gatedChannels.${categoryId}.channels`,
  })

  const sumIsChecked = useMemo(
    () =>
      Object.values(channels ?? {}).reduce<number>(
        (acc, curr: any) => acc + +curr.isChecked,
        0
      ),
    [channels]
  )

  const channelsLength = Object.keys(channels ?? {}).length

  return (
    <>
      {categoryId !== "-" && (
        <Checkbox
          isChecked={isGuarded || sumIsChecked === channelsLength}
          isDisabled={isGuarded}
          isIndeterminate={sumIsChecked > 0 && sumIsChecked < channelsLength}
          onChange={(e) => {
            Object.entries(channels).forEach(
              ([channelId, { name: channelName }]: any) => {
                setValue(
                  `rolePlatforms.${discordRolePlatformIndex}.platformRoleData.gatedChannels.${categoryId}.channels.${channelId}`,
                  {
                    name: channelName,
                    isChecked: e.target.checked,
                  },
                  { shouldTouch: true }
                )
              }
            )
          }}
        >
          {name}
        </Checkbox>
      )}

      <Stack pl={categoryId !== "-" ? 6 : 0} mt={1} spacing={1}>
        {Object.keys(channels ?? {}).map((channelId) => (
          <Channel
            key={channelId}
            categoryId={categoryId}
            channelId={channelId}
            isGuarded={isGuarded}
          />
        ))}
      </Stack>
    </>
  )
}

export default Category
