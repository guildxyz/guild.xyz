import { RequirementFormProps } from "requirements"
import AbsoluteBlockNumberFormControl from "./AbsoluteBlockNumberInput"

const AlchemyFirstTx = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <AbsoluteBlockNumberFormControl
    baseFieldPath={baseFieldPath}
    dataFieldName="minAmount"
    label="Wallet creation date"
  />
)

export default AlchemyFirstTx
