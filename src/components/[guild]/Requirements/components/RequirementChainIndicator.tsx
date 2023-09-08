import { Tag } from "@chakra-ui/react"
import { RPC } from "connectors"
import { useRequirementContext } from "./RequirementContext"

const RequirementChainIndicator = () => {
  const { chain } = useRequirementContext()

  if (!chain) return null

  return <Tag size="sm">{RPC[chain].chainName}</Tag>
}

export default RequirementChainIndicator
