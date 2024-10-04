import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@/components/ui/Popover"
import { CaretDown } from "@phosphor-icons/react/dist/ssr"
import { PropsWithChildren } from "react"
import { RequirementButton } from "./RequirementButton"

const ViewOriginalPopover = ({ children }: PropsWithChildren<unknown>) => (
  <Popover>
    <PopoverTrigger asChild>
      <RequirementButton rightIcon={<CaretDown weight="bold" />}>
        View original
      </RequirementButton>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent side="bottom" className="w-max max-w-[100vw]">
        {children}
      </PopoverContent>
    </PopoverPortal>
  </Popover>
)
export { ViewOriginalPopover }
