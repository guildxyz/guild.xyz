import { IconButton, Menu, MenuButton, MenuList, Portal } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { PiDotsThree } from "react-icons/pi"

const PlatformCardMenu = ({ children }: PropsWithChildren<unknown>) => (
  <Menu placement="bottom-end" closeOnSelect={false}>
    <MenuButton
      as={IconButton}
      icon={<PiDotsThree />}
      aria-label="Reward menu"
      boxSize={8}
      minW={8}
      rounded="full"
      colorScheme="alpha"
    />

    <Portal>
      <MenuList>{children}</MenuList>
    </Portal>
  </Menu>
)

export default PlatformCardMenu
