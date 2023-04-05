import { RequirementFormProps } from "requirements"
import BlockNumberFormControl from "./BlockNumberFormControl"

const AlchemyFirstTx = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <BlockNumberFormControl
    baseFieldPath={baseFieldPath}
    dataFieldName="maxAmount"
    label="Wallet created earlier than (date)"
    isRequired
    formHelperText="The date of the wallet's first transaction"
  />
)

export default AlchemyFirstTx
