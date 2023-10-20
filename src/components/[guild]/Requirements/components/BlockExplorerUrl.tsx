import { useColorMode } from "@chakra-ui/react"
import { RequirementLinkButton } from "components/[guild]/Requirements/components/RequirementButton"
import { blockExplorerIcons, Chain, CHAIN_CONFIG } from "connectors"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { useRequirementContext } from "./RequirementContext"

type Props = {
  chain?: Chain
  address?: string
  label?: string
  path?: string
}

const BlockExplorerUrl = ({
  chain: chainProp,
  address: addressProp,
  label,
  path: pathProp,
}: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const { chain, type, address, data } = useRequirementContext()

  const blockExplorerUrl =
    CHAIN_CONFIG[chainProp ?? chain].blockExplorers.default.url

  if (type === "COIN" || addressProp === NULL_ADDRESS || !blockExplorerUrl)
    return null

  // explorer.zksync.io doesn't support the /token path
  const path =
    pathProp ?? ((chainProp ?? chain) === "ZKSYNC_ERA" ? "address" : "token")

  const url =
    (type === "ERC1155" || type === "ERC721") && data?.id
      ? `${blockExplorerUrl}/token/${addressProp ?? address}?a=${data?.id}`
      : `${blockExplorerUrl}/${path}/${addressProp ?? address}`

  return (
    <RequirementLinkButton
      href={url}
      imageUrl={blockExplorerIcons[chainProp ?? chain][colorMode]}
    >
      {label ?? "View on explorer"}
    </RequirementLinkButton>
  )
}

export default BlockExplorerUrl
