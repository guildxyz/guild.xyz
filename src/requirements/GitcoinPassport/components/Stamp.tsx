import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { useController, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import useGitcoinPassportStamps from "../hooks/useGitcoinPassportStamps"

const Stamp = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const { errors } = useFormState()

  const {
    field: { name, onBlur, onChange, ref, value },
  } = useController({
    name: `${baseFieldPath}.data.stamp`,
    rules: { required: "This field is required" },
  })

  const { stamps, isStampsLoading } = useGitcoinPassportStamps()

  const selected = stamps.find((stamp) => stamp.value === value)

  return (
    <FormControl isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.stamp}>
      <FormLabel>Stamp</FormLabel>

      <StyledSelect
        isClearable
        ref={ref}
        name={name}
        isLoading={isStampsLoading}
        isDisabled={isStampsLoading}
        options={stamps}
        onChange={(newValue: SelectOption) => onChange(newValue?.value)}
        value={selected ?? ""}
        onBlur={onBlur}
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.stamp?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default Stamp
