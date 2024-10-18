import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import REQUIREMENTS from "requirements"

const LineaPOHRequirement = (props: RequirementProps) => (
  <Requirement image={REQUIREMENTS.LINEA_POH.icon as string} {...props}>
    Have a valid Proof of Humanity from Linea
  </Requirement>
)

export default LineaPOHRequirement
