import { IconButton, Menu, MenuButton, MenuList, Portal } from "@chakra-ui/react"
import { DotsThree } from "phosphor-react"
import { PropsWithChildren } from "react"

const PlatformCardMenu = ({ children }: PropsWithChildren<unknown>) => (
  <Menu placement="bottom-end" closeOnSelect={false}>
    <MenuButton
      as={IconButton}
      icon={<DotsThree />}
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
