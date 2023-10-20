import { Img, Tag, TagLabel, useColorModeValue } from "@chakra-ui/react"
import { CHAIN_CONFIG, chainIconUrls } from "chains"
import { useRequirementContext } from "./RequirementContext"

const RequirementChainIndicator = () => {
  const { chain } = useRequirementContext()
  const bg = useColorModeValue("white", "blackAlpha.300")

  if (!chain) return null

  return (
    <Tag size="sm" bg={bg}>
      <Img
        src={chainIconUrls[chain]}
        alt={CHAIN_CONFIG[chain].name}
        boxSize={3}
        mr={1}
      />
      <TagLabel>{CHAIN_CONFIG[chain].name}</TagLabel>
    </Tag>
  )
}

export default RequirementChainIndicator
