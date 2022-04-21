import {
  Button,
  Checkbox,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
} from "@chakra-ui/react"
import useServerData from "components/create-guild/PickRolePlatform/components/Discord/hooks/useServerData"
import useGuild from "components/[guild]/hooks/useGuild"
import { CaretDown } from "phosphor-react"
import { useState } from "react"

const ChannelsToGate = () => {
  const { platforms } = useGuild()
  const {
    data: { channels },
  } = useServerData(platforms?.[0]?.platformId)

  const [checkedItems, setCheckedItems] = useState<
    Record<
      string,
      {
        name: string
        channels: Record<string, { name: string; isChecked: boolean }>
      }
    >
  >({
    "test-category-id": {
      name: "test-channel",
      channels: Object.fromEntries(
        (channels ?? []).map(({ id, name }) => [id, { name, isChecked: false }])
      ),
    },
  })

  return (
    <Popover matchWidth>
      <PopoverTrigger>
        <Button
          rightIcon={<CaretDown />}
          h="12"
          justifyContent={"space-between"}
          w="full"
        >
          x channels gated
        </Button>
      </PopoverTrigger>

      <PopoverContent
        w="auto"
        borderRadius={"lg"}
        shadow="xl"
        maxH="sm"
        overflowY="auto"
      >
        <PopoverBody>
          {Object.entries(checkedItems).map(
            ([categoryId, { name: categoryName, channels: categoryChannels }]) => {
              const sumIsChecked = Object.values(categoryChannels).reduce(
                (acc, { isChecked }) => acc + +isChecked,
                0
              )

              const numOfChannels = Object.keys(categoryChannels).length

              return (
                <>
                  <Checkbox
                    key={categoryId}
                    isChecked={sumIsChecked === numOfChannels}
                    isIndeterminate={
                      sumIsChecked > 0 && sumIsChecked < numOfChannels
                    }
                    onChange={(e) =>
                      setCheckedItems((prev) => ({
                        ...prev,
                        [categoryId]: {
                          ...prev[categoryId],
                          channels: Object.fromEntries(
                            Object.entries(prev[categoryId].channels).map(
                              ([channelId, channel]) => [
                                channelId,
                                {
                                  ...channel,
                                  isChecked: e.target.checked,
                                },
                              ]
                            )
                          ),
                        },
                      }))
                    }
                  >
                    {categoryName}
                  </Checkbox>
                  <Stack pl={6} mt={1} spacing={1}>
                    {Object.entries(categoryChannels).map(([id, channel]) => (
                      <Checkbox
                        key={id}
                        isChecked={channel.isChecked}
                        onChange={(e) =>
                          setCheckedItems((prev) => ({
                            ...prev,
                            [categoryId]: {
                              ...prev[categoryId],
                              channels: {
                                ...prev[categoryId].channels,
                                [id]: {
                                  ...channel,
                                  isChecked: e.target.checked,
                                },
                              },
                            },
                          }))
                        }
                      >
                        {channel.name}
                      </Checkbox>
                    ))}
                  </Stack>
                </>
              )
            }
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default ChannelsToGate
