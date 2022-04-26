import { Checkbox, Stack } from "@chakra-ui/react"
import { useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import Channel from "./Channel"

type Props = { categoryId: string }

export type GatedChannels = Record<
  string,
  {
    name: string
    channels: Record<string, { name: string; isChecked: boolean }>
  }
>

const Category = ({ categoryId }: Props) => {
  const { setValue } = useFormContext()

  const name = useWatch<{ gatedChannels: GatedChannels }>({
    name: `gatedChannels.${categoryId}.name`,
  })

  const channels = useWatch<{ gatedChannels: GatedChannels }>({
    name: `gatedChannels.${categoryId}.channels`,
  })

  const sumIsChecked = useMemo(
    () =>
      Object.values(channels).reduce<number>(
        (acc, curr) => acc + +curr.isChecked,
        0
      ),
    [channels]
  )

  const channelsLength = Object.keys(channels).length

  return (
    <>
      {categoryId !== "-" && (
        <Checkbox
          isChecked={sumIsChecked === channelsLength}
          isIndeterminate={sumIsChecked > 0 && sumIsChecked < channelsLength}
          onChange={(e) => {
            Object.entries(channels).forEach(
              ([channelId, { name: channelName }]) => {
                setValue(
                  `gatedChannels.${categoryId}.channels.${channelId}`,
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
        {Object.keys(channels).map((channelId) => (
          <Channel key={channelId} categoryId={categoryId} channelId={channelId} />
        ))}
      </Stack>
    </>
  )
}

export default Category
