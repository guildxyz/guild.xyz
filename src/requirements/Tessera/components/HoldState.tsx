import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { useController, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import NumberField from "./NumberField"

const options = [
  { label: "Distribution", value: "distribution" },
  { label: "Marketplace", value: "marketplace" },
  { label: "Reconstitution", value: "reconstitution" },
  { label: "Closed", value: "closed" },
]
const HoldState = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const { errors } = useFormState()

  const {
    field: { name, onBlur, onChange, ref, value },
  } = useController({
    name: `${baseFieldPath}.data.vaultState`,
    rules: {
      required: "This field is required",
    },
  })

  return (
    <>
      <NumberField
        isRequired
        baseFieldPath={baseFieldPath}
        label="Minimum amount"
        fieldName="minAmount"
        min={1}
      />

      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.vaultState}
        isRequired
      >
        <FormLabel>Vault phase</FormLabel>

        <StyledSelect
          ref={ref}
          name={name}
          options={options}
          onChange={(newValue) => {
            onChange(newValue?.value)
          }}
          value={options.find((option) => option.value === value) ?? ""}
          onBlur={onBlur}
          isClearable
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.vaultState?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default HoldState
