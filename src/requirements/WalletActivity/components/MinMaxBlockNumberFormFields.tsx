import BlockNumberFormField from "./BlockNumberFormField"

type Props = {
  baseFieldPath: string
}

const MinMaxBlockNumberFormFields = ({ baseFieldPath }: Props): JSX.Element => (
  <>
    <BlockNumberFormField
      baseFieldPath={baseFieldPath}
      fieldName="minAmount"
      formLabel="Minimum block number"
      formHelperText="Start checking from this block"
    />

    <BlockNumberFormField
      baseFieldPath={baseFieldPath}
      fieldName="minAmount"
      formLabel="Maximum block number"
      formHelperText="Stop checking at this block"
    />
  </>
)

export default MinMaxBlockNumberFormFields
