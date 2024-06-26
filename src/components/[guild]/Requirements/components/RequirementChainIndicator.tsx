import { Img, Tag, TagLabel, TagProps, useColorModeValue } from "@chakra-ui/react"
import { CHAIN_CONFIG, Chain } from "wagmiConfig/chains"
import { useRequirementContext } from "./RequirementContext"

const RequirementChainIndicator = ({
  chain: chainFromProp,
  ...rest
}: { chain?: Chain } & TagProps) => {
  const { chain: chainFromContext } = useRequirementContext() ?? {}
  const chain = chainFromProp ?? chainFromContext
  const bg = useColorModeValue("white", "blackAlpha.300")

  if (!chain) return null

  return (
    <Tag size="sm" bg={bg} {...rest}>
      <Img
        src={CHAIN_CONFIG[chain].iconUrl}
        alt={CHAIN_CONFIG[chain].name}
        boxSize={3}
        mr={1}
      />
      <TagLabel>{CHAIN_CONFIG[chain].name}</TagLabel>
    </Tag>
  )
}

export default RequirementChainIndicator
