import { useColorMode } from "@chakra-ui/react"
import { blockExplorerIcons, RPC } from "connectors"
import { Requirement } from "types"
import { RequirementLinkButton } from "./RequirementButton"

type Props = {
  requirement: Requirement
}

const BlockExplorerUrl = ({ requirement }: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const blockExplorer = RPC[requirement.chain]?.blockExplorerUrls?.[0]

  if (requirement.type === "COIN" || !blockExplorer) return null

  return (
    <RequirementLinkButton
      href={`${blockExplorer}/token/${requirement.address}`}
      imageUrl={blockExplorerIcons[blockExplorer]?.[colorMode]}
    >
      View on explorer
    </RequirementLinkButton>
  )
}

export default BlockExplorerUrl
