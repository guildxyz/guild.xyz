import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useClipboard,
} from "@chakra-ui/react"
import { useCollectNftContext } from "components/[guild]/collect/components/CollectNftContext"
import { useThemeContext } from "components/[guild]/ThemeContext"
import { CopySimple, ShareNetwork, TwitterLogo } from "phosphor-react"
import useNftDetails from "../hooks/useNftDetails"

const ShareButton = () => {
  const { chain, address } = useCollectNftContext()
  const { data } = useNftDetails(chain, address)
  const pageLink =
    typeof window !== "undefined"
      ? `https://guild.xyz${window.location.pathname}`
      : ""
  const { onCopy, hasCopied } = useClipboard(pageLink)

  const { textColor, buttonColorScheme } = useThemeContext()

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={IconButton}
        aria-label="Share"
        icon={<ShareNetwork />}
        variant="ghost"
        rounded="full"
        size="sm"
        boxSize={8}
        minW="none"
        colorScheme={buttonColorScheme}
        color={textColor}
      />
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
                  data?.name ? `${data.name} ` : " "
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
