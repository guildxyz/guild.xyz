import { RequirementFormProps } from "requirements"
import BlockNumberFormControl from "./BlockNumberFormControl"

const AlchemyFirstTxRelative = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <BlockNumberFormControl
    type="RELATIVE"
    baseFieldPath={baseFieldPath}
    dataFieldName="maxAmount"
    label="Relative minimum wallet age"
    isRequired
    formHelperText="The date of the wallet's first transaction"
  />
)

export default AlchemyFirstTxRelative
