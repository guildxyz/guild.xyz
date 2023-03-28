import { RequirementFormProps } from "requirements"
import BlockNumberFormControl from "./BlockNumberFormControl"

const AlchemyFirstTx = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <BlockNumberFormControl
    baseFieldPath={baseFieldPath}
    dataFieldName="minAmount"
    label="Wallet creation date"
    isRequired
  />
)

export default AlchemyFirstTx
