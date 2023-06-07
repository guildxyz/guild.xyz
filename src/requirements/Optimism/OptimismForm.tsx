import { Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { ControlledCombobox } from "components/zag/Combobox"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
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
    label: "Have an Optimist PFP",
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

  const type = useWatch({ name: `${baseFieldPath}.type` })

  const selected = typeOptions.find((reqType) => reqType.value === type)

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

        <ControlledCombobox
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={typeOptions}
          beforeOnChange={resetFields}
          placeholder="Select type"
          disableOptionFiltering
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
