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

const ChannelsToGate = () => {
  const [checkedItems, setCheckedItems] = React.useState([false, false])

  const allChecked = checkedItems.every(Boolean)
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked

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
          <Checkbox
            isChecked={allChecked}
            isIndeterminate={isIndeterminate}
            onChange={(e) => setCheckedItems([e.target.checked, e.target.checked])}
          >
            category-name
          </Checkbox>
          <Stack pl={6} mt={1} spacing={1}>
            <Checkbox
              isChecked={checkedItems[0]}
              onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1]])}
            >
              channel-1-name
            </Checkbox>
            <Checkbox
              isChecked={checkedItems[1]}
              onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
            >
              channel-2-name
            </Checkbox>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default ChannelsToGate
