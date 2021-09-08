import {
  IconButton,
  Icon,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import { Code, Info } from "phosphor-react"
import Logo from "./components/Logo"

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
      <Icon width="1.4em" height="1.4em" as={Info} />
    </MenuButton>
    <MenuList border="none" shadow="md">
      <MenuGroup title="Powered by agora.space" pb="2">
        <MenuItem
          py="2"
          as="a"
          target="_blank"
          href="https://agora.space/"
          rel="noopener"
          icon={<Info />}
        >
          About
        </MenuItem>
        <MenuItem
          py="2"
          as="a"
          target="_blank"
          href="https://github.com/AgoraSpaceDAO/guild.xyz"
          rel="noopener"
          icon={<Code />}
        >
          Code
        </MenuItem>
      </MenuGroup>
    </MenuList>
  </Menu>
)

export default LogoWithMenu
