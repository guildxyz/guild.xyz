import { Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { useEffect } from "react"
import { useController, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import Attestation from "./components/Attestation"

const typeOptions = [
  {
    value: "OPTIMISM_ATTESTATION",
    label: "Attestation",
    OptimismRequirement: Attestation,
  },
  {
    value: "OPTIMISM_PFP",
    label: "Have an Optimism pfp",
  },
]

const OptimismForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    register,
    resetField,
    formState: { errors },
  } = useFormContext()

  useEffect(() => {
    if (!register) return
    register(`${baseFieldPath}.chain`, {
      value: "OPTIMISM",
    })
  }, [register])

  const {
    field: { name, onBlur, onChange, ref, value },
  } = useController({
    name: `${baseFieldPath}.type`,
    rules: { required: "It's required to select a type" },
  })

  const selected = typeOptions.find((reqType) => reqType.value === value)

  const resetFields = () => {
    resetField(`${baseFieldPath}.data.creator`)
    resetField(`${baseFieldPath}.data.key`)
    resetField(`${baseFieldPath}.data.val`)
  }

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type}
      >
        <FormLabel>Type</FormLabel>

        <StyledSelect
          options={typeOptions}
          name={name}
          onBlur={onBlur}
          onChange={(newValue: SelectOption) => {
            resetFields()
            onChange(newValue?.value)
          }}
          ref={ref}
          value={selected}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.OptimismRequirement && (
        <>
          <Divider />
          <selected.OptimismRequirement baseFieldPath={baseFieldPath} />
        </>
      )}
    </Stack>
  )
}

export default OptimismForm
