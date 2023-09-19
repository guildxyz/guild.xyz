import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Stack,
} from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  options: JSX.Element[]
}

const ClickableTagPopover = ({
  options,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <Popover>
    <PopoverTrigger>{children}</PopoverTrigger>

    <Portal>
      <PopoverContent w="max-content">
        <PopoverArrow />

        <PopoverBody p={0} borderRadius="xl" overflow="hidden">
          <Stack spacing={0}>{options}</Stack>
        </PopoverBody>
      </PopoverContent>
    </Portal>
  </Popover>
)

export default ClickableTagPopover
