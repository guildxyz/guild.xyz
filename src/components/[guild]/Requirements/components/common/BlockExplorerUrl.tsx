import { HStack, Icon, Img, useColorMode } from "@chakra-ui/react"
import Link from "components/common/Link"
import { blockExplorerIcons, RPC } from "connectors"
import { ArrowSquareOut } from "phosphor-react"
import { Requirement } from "types"

type Props = {
  requirement: Requirement
}

const BlockExplorerUrl = ({ requirement }: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const blockExplorer = RPC[requirement.chain]?.blockExplorerUrls?.[0]

  if (requirement.type === "COIN") return null

  return (
    <HStack>
      <Img
        src={blockExplorerIcons[blockExplorer]?.[colorMode]}
        alt={blockExplorer}
        boxSize={3}
      />
      <Link
        href={`${blockExplorer}/token/${requirement.address}`}
        isExternal
        fontSize="xs"
        color="gray"
      >
        View on explorer
        <Icon as={ArrowSquareOut} mx={1} />
      </Link>
    </HStack>
  )
}

export default BlockExplorerUrl
