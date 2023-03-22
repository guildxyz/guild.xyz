import { useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import TokenPicker from "requirements/common/TokenPicker"
import MinMaxBlockNumberFormFields from "./MinMaxBlockNumberFormFields"
import TxCountFormField from "./TxCountFormField"

const AlchemyTxValue = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const chain = useWatch({ name: `${baseFieldPath}.chain` })

  return (
    <>
      <TokenPicker
        chain={chain}
        fieldName={`${baseFieldPath}.address`}
        rules={{ required: "This field is required" }}
      />

      <TxCountFormField
        baseFieldPath={baseFieldPath}
        formLabel="Number of transactions"
      />

      <MinMaxBlockNumberFormFields baseFieldPath={baseFieldPath} />
    </>
  )
}

export default AlchemyTxValue
