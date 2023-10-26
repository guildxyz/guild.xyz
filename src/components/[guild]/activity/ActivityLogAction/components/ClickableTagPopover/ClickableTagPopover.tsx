import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Stack,
} from "@chakra-ui/react"
import React, { PropsWithChildren } from "react"

type Props = {
  options: JSX.Element
  shouldRenderPortal?: boolean
}

const ClickableTagPopover = ({
  options,
  shouldRenderPortal = true,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const WrapperComponent = shouldRenderPortal ? Portal : React.Fragment

  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>

      <WrapperComponent>
        <PopoverContent w="max-content">
          <PopoverArrow />
          <PopoverBody p={0} borderRadius="xl" overflow="hidden">
            <Stack spacing={0}>{options}</Stack>
          </PopoverBody>
        </PopoverContent>
      </WrapperComponent>
    </Popover>
  )
}

export default ClickableTagPopover
