import {
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { PiCaretDown } from "react-icons/pi"
import { RequirementButton } from "./RequirementButton"

const ViewOriginalPopover = ({ children }: PropsWithChildren<unknown>) => (
  <Popover placement="bottom-start">
    <PopoverTrigger>
      <RequirementButton rightIcon={<Icon as={PiCaretDown} />}>
        View original
      </RequirementButton>
    </PopoverTrigger>
    <Portal>
      <PopoverContent w="max-content" maxWidth={"100vw"}>
        {children}
      </PopoverContent>
    </Portal>
  </Popover>
)
export default ViewOriginalPopover
