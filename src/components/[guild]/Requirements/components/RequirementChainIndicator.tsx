import { Img, Tag, TagLabel, useColorModeValue } from "@chakra-ui/react"
import { RPC } from "connectors"
import { useRequirementContext } from "./RequirementContext"

const RequirementChainIndicator = () => {
  const { chain } = useRequirementContext()
  const bg = useColorModeValue("white", "blackAlpha.300")

  const { chainName, iconUrls } = RPC[chain] ?? {}

  if (!chainName || !iconUrls?.length) return null

  return (
    <Tag size="sm" bg={bg}>
      <Img src={iconUrls[0]} alt={chainName} boxSize={3} mr={1} />
      <TagLabel>{chainName}</TagLabel>
    </Tag>
  )
}

export default RequirementChainIndicator
