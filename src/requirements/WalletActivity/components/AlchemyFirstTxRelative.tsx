import { RequirementFormProps } from "requirements"
import BlockNumberInput from "./BlockNumberInput"

const AlchemyFirstTxRelative = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <BlockNumberInput
    baseFieldPath={baseFieldPath}
    formLabel="Block number"
    formHelperText="Wallet should be created before this block"
  />
)

export default AlchemyFirstTxRelative
