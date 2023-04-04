import { RequirementFormProps } from "requirements"
import BlockNumberFormControl from "./BlockNumberFormControl"

const AlchemyFirstTx = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <BlockNumberFormControl
    baseFieldPath={baseFieldPath}
    dataFieldName="maxAmount"
    label="Minimum wallet creation date"
    isRequired
    formHelperText="The date of the wallet's first transaction"
  />
)

export default AlchemyFirstTx
