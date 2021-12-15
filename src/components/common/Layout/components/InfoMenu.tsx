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
import { useWeb3React } from "@web3-react/core"
import { ArrowSquareOut, Code, Info, RocketLaunch } from "phosphor-react"
import useSWRImmutable from "swr/immutable"

const InfoMenu = (): JSX.Element => {
  const { account } = useWeb3React()
  const { data: upvotyJWT } = useSWRImmutable(
    account ? `/user/upvotyAuth/${account}` : null
  )

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
        <MenuGroup
          title={
            (
              <>
                Powered by
                <Link
                  href="https://alpha.guild.xyz/guide"
                  isExternal
                  ml="1"
                  fontWeight={"bold"}
                >
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
            href={
              upvotyJWT
                ? `https://roadmap.guild.xyz/front/handleSSO/${upvotyJWT}/?redirectUrl=https://roadmap.guild.xyz/?__force`
                : "https://roadmap.guild.xyz/?__force"
            }
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
