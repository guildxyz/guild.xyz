import { useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import TokenPicker from "requirements/common/TokenPicker"
import MinMaxBlockNumberFormControls from "./MinMaxBlockNumberFormControls"
import TxValueFormControl from "./TxValueFormControl"

const AlchemyTxValueRelative = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => {
  const chain = useWatch({ name: `${baseFieldPath}.chain` })

  return (
    <>
      <TokenPicker
        chain={chain}
        fieldName={`${baseFieldPath}.address`}
        rules={{ required: "This field is required" }}
      />

      <TxValueFormControl baseFieldPath={baseFieldPath} />

      <MinMaxBlockNumberFormControls baseFieldPath={baseFieldPath} type="RELATIVE" />
    </>
  )
}

export default AlchemyTxValueRelative
