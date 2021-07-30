import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import { Link } from "components/common/Link"
import { useRouter } from "next/dist/client/router"
import { ArrowLeft, Code, Info, MagnifyingGlass } from "phosphor-react"
import Logo from "./Logo"

const LogoWithMenu = () => {
  const router: any = useRouter()

  if (router.route === "/" || router.components?.["/[community]"]?.initial) {
    return (
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
  }

  return (
    <Link href="/">
      <IconButton
        aria-label="Back to explorer"
        variant="ghost"
        isRound
        icon={<Icon as={ArrowLeft} />}
        width={10}
        height={10}
      />
    </Link>
  )
}

export default LogoWithMenu
