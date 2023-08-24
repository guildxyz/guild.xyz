import { useColorMode } from "@chakra-ui/react"
import { RequirementLinkButton } from "components/[guild]/Requirements/components/RequirementButton"
import { Chain, RPC } from "connectors"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { useRequirementContext } from "./RequirementContext"

type Props = {
  chain?: Chain
  address?: string
}

const BlockExplorerUrl = ({
  chain: chainProp,
  address: addressProp,
}: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const { chain, type, address, data } = useRequirementContext()

  const blockExplorer = RPC[chainProp ?? chain]?.blockExplorerUrls?.[0]

  if (type === "COIN" || addressProp === NULL_ADDRESS || !blockExplorer) return null

  // explorer.zksync.io doesn't support the /token path
  const path = (chainProp ?? chain) === "ZKSYNC_ERA" ? "address" : "token"

  const url =
    (type === "ERC1155" || type === "ERC721") && data?.id
      ? `${blockExplorer}/nft/${addressProp ?? address}/${data?.id}`
      : `${blockExplorer}/${path}/${addressProp ?? address}`

  return (
    <RequirementLinkButton
      href={url}
      imageUrl={RPC[chainProp ?? chain]?.blockExplorerIcons[colorMode]}
    >
      View on explorer
    </RequirementLinkButton>
  )
}

export default BlockExplorerUrl
