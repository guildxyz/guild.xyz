import { useColorMode } from "@chakra-ui/react"
import { RequirementLinkButton } from "components/[guild]/Requirements/components/RequirementButton"
import { blockExplorerIcons, RPC } from "connectors"
import { useRequirementContext } from "./RequirementContext"

const BlockExplorerUrl = (): JSX.Element => {
  const { colorMode } = useColorMode()
  const { chain, type, address } = useRequirementContext()

  const blockExplorer = RPC[chain]?.blockExplorerUrls?.[0]

  if (type === "COIN" || !blockExplorer) return null

  return (
    <RequirementLinkButton
      href={`${blockExplorer}/token/${address}`}
      imageUrl={blockExplorerIcons[blockExplorer]?.[colorMode]}
    >
      View on explorer
    </RequirementLinkButton>
  )
}

export default BlockExplorerUrl
