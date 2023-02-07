import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"

const UnlockRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  return (
    <Requirement image={`/requirementLogos/polygonId.svg`} {...props}>
      Have a PolygonID
    </Requirement>
  )
}

export default UnlockRequirement
