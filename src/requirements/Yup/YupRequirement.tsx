import { RequirementComponentProps } from "requirements"
import Requirement from "requirements/common/Requirement"

const YupRequirement = ({
  requirement,
  ...rest
}: RequirementComponentProps): JSX.Element => (
  <Requirement image="/requirementLogos/yup.svg" {...rest}>
    {`Have at least ${requirement.data.minAmount} score`}
    {requirement.data.adapter && ` of the ${requirement.data.adapter} adapter`}
  </Requirement>
)

export default YupRequirement
