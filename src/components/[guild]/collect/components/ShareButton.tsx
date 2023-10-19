import { Menu, MenuButton, MenuItem, MenuList, useClipboard } from "@chakra-ui/react"
import { useThemeContext } from "components/[guild]/ThemeContext"
import { useCollectNftContext } from "components/[guild]/collect/components/CollectNftContext"
import Button from "components/common/Button"
import { CopySimple, ShareNetwork, TwitterLogo } from "phosphor-react"
import useNftDetails from "../hooks/useNftDetails"

type Props = {
  onClick?: () => void
}

const ShareButton = ({ onClick }: Props): JSX.Element => {
  const { chain, nftAddress } = useCollectNftContext()
  const { name } = useNftDetails(chain, nftAddress)
  const pageLink =
    typeof window !== "undefined"
      ? `https://guild.xyz${window.location.pathname}`
      : ""
  const { onCopy, hasCopied } = useClipboard(pageLink)

  const { textColor, buttonColorScheme } = useThemeContext()

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        leftIcon={<ShareNetwork />}
        variant="ghost"
        size="sm"
        colorScheme={buttonColorScheme}
        color={textColor}
        onClick={onClick}
      >
        Share
      </MenuButton>
      <MenuList>
        <MenuItem icon={<CopySimple size={12} />} fontSize="sm" onClick={onCopy}>
          {hasCopied ? "Copied!" : "Copy URL"}
        </MenuItem>
        <MenuItem
          icon={<TwitterLogo size={12} />}
          fontSize="sm"
          onClick={() => {
            if (typeof window === "undefined") return
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `Check out and collect this awesome ${
                  name ? `${name} ` : " "
                }NFT on Guild!\n${pageLink}`
              )}`,
              "_blank"
            )
          }}
        >
          Tweet
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default ShareButton
