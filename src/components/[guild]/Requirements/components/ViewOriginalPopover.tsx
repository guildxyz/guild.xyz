import { Popover, PopoverContent, PopoverTrigger, Portal } from "@chakra-ui/react"
import { CaretDown } from "@phosphor-icons/react/dist/ssr"
import { PropsWithChildren } from "react"
import { RequirementButton } from "./RequirementButton"

const ViewOriginalPopover = ({ children }: PropsWithChildren<unknown>) => (
  <Popover placement="bottom-start">
    <PopoverTrigger>
      <RequirementButton rightIcon={<CaretDown weight="bold" />}>
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
