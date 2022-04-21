import {
  Button,
  Checkbox,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
} from "@chakra-ui/react"
import { CaretDown } from "phosphor-react"
import React from "react"

const data: Record<
  string,
  {
    name: string
    channels: Record<string, { name: string; isChecked: boolean }>
  }
> = {
  "category-id": {
    name: "category-name",
    channels: {
      "channel-id-1": { name: "channel-name-1", isChecked: false },
      "channel-id-2": { name: "channel-name-2", isChecked: false },
      "channel-id-3": { name: "channel-name-3", isChecked: false },
    },
  },
}

const ChannelsToGate = () => {
  const [checkedItems, setCheckedItems] = React.useState(data)

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

      <PopoverContent w="auto" borderRadius={"lg"} shadow="xl">
        <PopoverBody>
          {Object.entries(checkedItems).map(
            ([categoryId, { name: categoryName, channels }]) => {
              const sumIsChecked = Object.values(
                checkedItems[categoryId].channels
              ).reduce((acc, { isChecked }) => acc + +isChecked, 0)

              const numOfChannels = Object.keys(
                checkedItems[categoryId].channels
              ).length

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
                    {Object.entries(channels).map(([id, channel]) => (
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
