import { Img, useColorMode } from "@chakra-ui/react"
import Button from "components/common/Button"
import { blockExplorerIcons, RPC } from "connectors"
import { Requirement } from "types"

type Props = {
  requirement: Requirement
}

const BlockExplorerUrl = ({ requirement }: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const blockExplorer = RPC[requirement.chain]?.blockExplorerUrls?.[0]

  if (requirement.type === "COIN") return null

  return (
    <Button
      as="a"
      href={`${blockExplorer}/token/${requirement.address}`}
      target="_blank"
      size="xs"
      borderRadius="lg"
      variant="ghost"
      leftIcon={
        <Img
          src={blockExplorerIcons[blockExplorer]?.[colorMode]}
          alt={blockExplorer}
          boxSize={4}
        />
      }
    >
      View on explorer
    </Button>
  )
}

export default BlockExplorerUrl
