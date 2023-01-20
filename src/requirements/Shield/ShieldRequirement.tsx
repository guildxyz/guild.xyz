import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"

const ShieldRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image="/requirementLogos/shield.png"
      {...props}
    >
      {(() => {
        switch (requirement.type) {
          case "SHIELD_ANOM_TX":
            return "Don't have anomalous transaction patterns"
          case "SHIELD_UNVERIFIED_CONTRACT":
            return "Don't have a history of creating an unverified contracts"
          case "SHIELD_EXPLOIT_INTERACTION":
            return "Don't have interaction with known exploits"
          case "SHIELD_INDIRECT_DEPOSITS":
            return "Don't have frequent indirect exchange deposits"
          case "SHIELD_TORNADO_CASH":
            return `Don't have interactions with Tornado Cash${
              requirement.data.hops ? "(with hops)" : ""
            }`
        }
      })()}
    </Requirement>
  )
}

export default ShieldRequirement
