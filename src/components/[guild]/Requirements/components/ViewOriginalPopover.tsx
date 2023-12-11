import {
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react"
import { CaretDown } from "phosphor-react"
import { PropsWithChildren } from "react"
import { RequirementButton } from "./RequirementButton"

const ViewOriginalPopover = ({ children }: PropsWithChildren<unknown>) => (
  <Popover placement="bottom-start">
    <PopoverTrigger>
      <RequirementButton rightIcon={<Icon as={CaretDown} />}>
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
