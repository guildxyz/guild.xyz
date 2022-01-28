import {
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import { ArrowSquareOut, Code, Info, RocketLaunch } from "phosphor-react"
import useUpvoty from "./hooks/useUpvoty"

const InfoMenu = (): JSX.Element => {
  const { url: upvotyUrl } = useUpvoty()

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Agora logo"
        isRound
        variant="ghost"
        h="10"
        icon={<Icon width="1.2em" height="1.2em" as={Info} />}
      />
      {/* have to set zIndex, otherwise the search bar's icon lays over it */}
      <MenuList border="none" shadow="md" zIndex="3">
        <MenuGroup
          title={
            (
              <>
                Powered by
                <Link href="https://agora.xyz" isExternal ml="1" fontWeight={"bold"}>
                  agora.xyz
                  <Icon as={ArrowSquareOut} ml="1" />
                </Link>
              </>
            ) as any
          }
          pb="2"
        >
          <MenuItem
            py="2"
            as="a"
            target="_blank"
            href="https://alpha.guild.xyz/guide"
            rel="noopener"
            icon={<Info />}
          >
            Guide
          </MenuItem>
          <MenuItem
            py="2"
            as="a"
            target="_blank"
            href={upvotyUrl}
            rel="noopener"
            icon={<RocketLaunch />}
          >
            Roadmap
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
}

export default InfoMenu
