import {
  ButtonProps,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Portal,
  useColorModeValue,
} from "@chakra-ui/react"
import { DotsThree } from "@phosphor-icons/react"
import { PropsWithChildren } from "react"

const PlatformCardMenu = ({ children }: PropsWithChildren<unknown>) => {
  const colorScheme = useColorModeValue<
    ButtonProps["colorScheme"],
    ButtonProps["colorScheme"]
  >(undefined, "alpha")

  return (
    <Menu placement="bottom-end" closeOnSelect={false}>
      <MenuButton
        as={IconButton}
        icon={<DotsThree />}
        aria-label="Reward menu"
        boxSize={8}
        minW={8}
        rounded="full"
        colorScheme={colorScheme}
      />

      <Portal>
        <MenuList>{children}</MenuList>
      </Portal>
    </Menu>
  )
}

export default PlatformCardMenu
