import { RequirementComponentProps } from "requirements"
import DataBlock from "requirements/common/DataBlock"
import Requirement from "requirements/common/Requirement"

const YupRequirement = ({
  requirement,
  ...rest
}: RequirementComponentProps): JSX.Element => (
  <Requirement image="/requirementLogos/yup.svg" {...rest}>
    {`Have a Yup Score of at least ${requirement.data.minAmount} `}
    {requirement.data.adapter && (
      <>
        {" from the "}
        <DataBlock>{requirement.data.adapter}</DataBlock>
        {" adapter"}
      </>
    )}
  </Requirement>
)

export default YupRequirement
