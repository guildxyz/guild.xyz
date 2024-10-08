import { Badge, BadgeProps } from "@/components/ui/Badge"
import { Requirement } from "types"
import { CHAIN_CONFIG } from "wagmiConfig/chains"
import { useRequirementContext } from "./RequirementContext"

const RequirementChainIndicator = ({
  chain: chainFromProp,
  ...badgeProps
}: { chain?: Requirement["chain"] } & BadgeProps) => {
  const { chain: chainFromContext } = useRequirementContext() ?? {}
  const chain = chainFromProp ?? chainFromContext

  if (!chain) return null

  return (
    <Badge size="sm" {...badgeProps}>
      <img
        src={CHAIN_CONFIG[chain].iconUrl}
        alt={CHAIN_CONFIG[chain].name}
        className="size-3"
      />
      <span>{CHAIN_CONFIG[chain].name}</span>
    </Badge>
  )
}

export { RequirementChainIndicator }
