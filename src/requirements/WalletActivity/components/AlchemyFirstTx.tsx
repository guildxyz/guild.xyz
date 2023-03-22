import { RequirementFormProps } from "requirements"
import BlockNumberInput from "./BlockNumberInput"

const AlchemyFirstTx = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <BlockNumberInput
    baseFieldPath={baseFieldPath}
    formLabel="Number of blocks"
    formHelperText="Wallet should be at least x blocks old"
  />
)

export default AlchemyFirstTx
