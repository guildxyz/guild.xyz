import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  useColorMode,
} from "@chakra-ui/react"
import Code from "static/icons/code.svg"
import Info from "static/icons/info.svg"

const InfoMenu = () => {
  const { toggleColorMode } = useColorMode()

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Agora logo"
        rounded="full"
        variant="ghost"
        h="10"
      >
        <Icon width="1.2em" height="1.2em" as={Info} />
      </MenuButton>
      {/* have to set zIndex, otherwise the search bar's icon lays over it */}
      <MenuList border="none" shadow="md" zIndex="3">
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
          {/* <MenuItem
            py="2"
            icon={<Sun />}
            closeOnSelect={false}
            onClick={toggleColorMode}
          >
            Theme
          </MenuItem> */}
        </MenuGroup>
      </MenuList>
    </Menu>
  )
}

export default InfoMenu
