import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import Link from "next/link"
import { ArrowLeft, Code, Info, MagnifyingGlass } from "phosphor-react"
import Logo from "./components/Logo"

const LogoWithMenu = () => {
  const router: any = useRouter()

  if (router.route === "/" || !router.components?.["/"]) {
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
        {/* have to set zIndex, otherwise the search bar's icon lays over it */}
        <MenuList border="none" shadow="md" zIndex="3">
          <MenuGroup title="Powered by agora.space" pb="2">
            <Link href="/" passHref>
              <MenuItem py="2" as="a" icon={<MagnifyingGlass />}>
                Explorer
              </MenuItem>
            </Link>
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
    <Link href="/" passHref>
      <IconButton
        as="a"
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
