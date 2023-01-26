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
            return "Have anomalous transaction patterns"
          case "SHIELD_UNVERIFIED_CONTRACT":
            return "Have a history of creating unverified contracts"
          case "SHIELD_EXPLOIT_INTERACTION":
            return "Have interactions with known exploits"
          case "SHIELD_INDIRECT_DEPOSITS":
            return "Have frequent indirect exchange deposits"
          case "SHIELD_TORNADO_CASH":
            return `Have direct${
              requirement.data.hops ? " or indirect" : ""
            } interactions with Tornado Cash`
        }
      })()}
    </Requirement>
  )
}

export default ShieldRequirement
