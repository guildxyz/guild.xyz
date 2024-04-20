import { Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useController, useFormContext, useWatch } from "react-hook-form"
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

const OptimismForm = ({
  baseFieldPath,
  field,
}: RequirementFormProps): JSX.Element => {
  const {
    resetField,
    formState: { errors },
  } = useFormContext()

  useController({
    name: `${baseFieldPath}.chain`,
    defaultValue: "OPTIMISM",
  })

  const type = useWatch({ name: `${baseFieldPath}.type` })

  const isEditMode = !!field?.id

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

        <ControlledSelect
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={typeOptions}
          beforeOnChange={resetFields}
          isDisabled={isEditMode}
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
