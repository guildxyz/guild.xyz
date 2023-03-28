import BlockNumberFormControl from "./BlockNumberFormControl"

type Props = {
  baseFieldPath: string
  type?: "ABSOLUTE" | "RELATIVE"
}

const MinMaxBlockNumberFormControls = ({
  baseFieldPath,
  type = "ABSOLUTE",
}: Props): JSX.Element => (
  <>
    <BlockNumberFormControl
      baseFieldPath={baseFieldPath}
      dataFieldName="minAmount"
      label="From"
      type={type}
    />

    <BlockNumberFormControl
      baseFieldPath={baseFieldPath}
      dataFieldName="maxAmount"
      label="To"
      type={type}
    />
  </>
)

export default MinMaxBlockNumberFormControls
