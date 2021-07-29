import {
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import { Code, Info, MagnifyingGlass } from "phosphor-react"
import Logo from "./Logo"

const LogoWithMenu = () => (
  <Menu>
    <MenuButton
      as={IconButton}
      aria-label="Agora logo"
      variant="ghost"
      isRound
      width={10}
      height={10}
    >
      <Logo width="1m" height="1em" />
    </MenuButton>
    <MenuList border="none" shadow="md">
      <MenuGroup title="Powered by agora.space" pb="2">
        <MenuItem py="2" as="a" href="/" icon={<MagnifyingGlass />}>
          Explorer
        </MenuItem>
        <MenuItem
          py="2"
          as="a"
          target="_blank"
          href="https://agora.space/"
          icon={<Info />}
        >
          About
        </MenuItem>
        <MenuItem
          py="2"
          as="a"
          target="_blank"
          href="https://github.com/AgoraSpaceDAO"
          icon={<Code />}
        >
          Code
        </MenuItem>
      </MenuGroup>
    </MenuList>
  </Menu>
)

export default LogoWithMenu
