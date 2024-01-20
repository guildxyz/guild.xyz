import {
  Center,
  Icon,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Tag,
  Text,
} from "@chakra-ui/react"
import { FC, PropsWithChildren } from "react"

type Props = {
  colorScheme: string
  icon: FC
  amount?: number
}

const CrmRoleAccessIndicatorUI = ({
  colorScheme,
  icon,
  amount,
  children,
}: PropsWithChildren<Props>) => (
  <Center>
    <Popover placement="left" trigger="hover" closeDelay={100}>
      <PopoverTrigger>
        <Tag colorScheme={colorScheme} px="1.5">
          <Icon as={icon} boxSize={3} />
          {amount && <Text ml={1.5}>{amount.toFixed(2)}</Text>}
        </Tag>
      </PopoverTrigger>
      <Portal>
        <PopoverContent width="unset" maxW={{ base: "2xs", md: "xs" }}>
          {children}
          <PopoverArrow />
        </PopoverContent>
      </Portal>
    </Popover>
  </Center>
)

export default CrmRoleAccessIndicatorUI
