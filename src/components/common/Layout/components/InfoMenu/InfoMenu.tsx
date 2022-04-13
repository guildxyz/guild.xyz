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
import {
  ArrowSquareOut,
  Code,
  DiscordLogo,
  DownloadSimple,
  Info,
  RocketLaunch,
  TwitterLogo,
} from "phosphor-react"
import useUpvoty from "./hooks/useUpvoty"

const InfoMenu = (): JSX.Element => {
  const { url: upvotyUrl } = useUpvoty()

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Info menu"
        isRound
        variant="ghost"
        h="10"
        icon={<Icon width="1.2em" height="1.2em" as={Info} />}
        data-dd-action-name="Info menu"
      />
      {/* have to set zIndex, otherwise the search bar's icon lays over it */}
      <MenuList border="none" shadow="md" zIndex="dropdown">
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
            href="https://docs.guild.xyz/guild"
            rel="noopener"
            icon={<Info />}
            data-dd-action-name="Info menu - Guide"
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
            data-dd-action-name="Info menu - Roadmap"
          >
            Roadmap
          </MenuItem>
          <MenuItem
            py="2"
            as="a"
            target="_blank"
            href="https://discord.gg/guildxyz"
            rel="noopener"
            icon={<DiscordLogo />}
            data-dd-action-name="Info menu - Discord"
          >
            Discord
          </MenuItem>
          <MenuItem
            py="2"
            as="a"
            target="_blank"
            href="https://twitter.com/guildxyz"
            rel="noopener"
            icon={<TwitterLogo />}
            data-dd-action-name="Info menu - Twitter"
          >
            Twitter
          </MenuItem>
          <MenuItem
            py="2"
            as="a"
            target="_blank"
            href="/guild-xyz-brand-kit.zip"
            rel="noopener"
            icon={<DownloadSimple />}
            data-dd-action-name="Info menu - Brand kit"
          >
            Brand kit
          </MenuItem>
          <MenuItem
            py="2"
            as="a"
            target="_blank"
            href="https://github.com/agoraxyz/guild.xyz"
            rel="noopener"
            icon={<Code />}
            data-dd-action-name="Info menu - Code"
          >
            Code
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  )
}

export default InfoMenu
