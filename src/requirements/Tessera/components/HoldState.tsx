import { FormControl, FormLabel } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormState } from "react-hook-form"
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

        <ControlledSelect
          name={`${baseFieldPath}.data.vaultState`}
          rules={{
            required: "This field is required",
          }}
          options={options}
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
