import { useColorMode } from "@chakra-ui/react"
import { RequirementLinkButton } from "components/[guild]/Requirements/components/RequirementButton"
import { blockExplorerIcons, Chain, RPC } from "connectors"
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
  const { chain, type, address } = useRequirementContext()

  const blockExplorer = RPC[chainProp ?? chain]?.blockExplorerUrls?.[0]

  if (type === "COIN" || addressProp === NULL_ADDRESS || !blockExplorer) return null

  return (
    <RequirementLinkButton
      href={`${blockExplorer}/token/${addressProp ?? address}`}
      imageUrl={blockExplorerIcons[blockExplorer]?.[colorMode]}
    >
      View on explorer
    </RequirementLinkButton>
  )
}

export default BlockExplorerUrl
