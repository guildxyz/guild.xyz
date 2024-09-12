import {
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react"
import { WarningCircle } from "@phosphor-icons/react"
import { PropsWithChildren, ReactNode } from "react"

const CardWarningComponentBase = ({ children }: PropsWithChildren): ReactNode => {
  return (
    <Popover trigger="hover" openDelay={0}>
      <PopoverTrigger>
        <Icon
          as={WarningCircle}
          color="orange.300"
          weight="fill"
          boxSize={6}
          tabIndex={0}
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>{children}</PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

export { CardWarningComponentBase }
