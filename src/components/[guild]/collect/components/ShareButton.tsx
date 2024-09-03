import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  useClipboard,
} from "@chakra-ui/react"
import { CopySimple, ShareNetwork } from "@phosphor-icons/react"
import { XLogo } from "@phosphor-icons/react/dist/ssr"
import { useThemeContext } from "components/[guild]/ThemeContext"
import Button from "components/common/Button"
import FarcasterLogo from "static/socialIcons/farcaster.svg"

type Props = {
  onClick?: () => void
  shareText: string
}

const ShareButton = ({ onClick, shareText }: Props): JSX.Element => {
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
      <Portal>
        <MenuList>
          <MenuItem icon={<CopySimple size={12} />} fontSize="sm" onClick={onCopy}>
            {hasCopied ? "Copied!" : "Copy URL"}
          </MenuItem>
          <MenuItem
            icon={<FarcasterLogo size={12} />}
            fontSize="sm"
            onClick={() => {
              if (typeof window === "undefined") return
              window.open(
                `https://warpcast.com/~/compose?text=${encodeURIComponent(
                  `${shareText}\n${pageLink}`
                )}`,
                "_blank"
              )
            }}
          >
            Cast
          </MenuItem>
          <MenuItem
            icon={<XLogo size={12} />}
            fontSize="sm"
            onClick={() => {
              if (typeof window === "undefined") return
              window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `${shareText}\n${pageLink}`
                )}`,
                "_blank"
              )
            }}
          >
            Tweet
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  )
}

export default ShareButton
