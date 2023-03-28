import { RequirementFormProps } from "requirements"
import BlockNumberFormControl from "./BlockNumberFormControl"

const AlchemyFirstTxRelative = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <BlockNumberFormControl
    type="RELATIVE"
    baseFieldPath={baseFieldPath}
    dataFieldName="minAmount"
    label="Relative wallet age"
    isRequired
  />
)

export default AlchemyFirstTxRelative
