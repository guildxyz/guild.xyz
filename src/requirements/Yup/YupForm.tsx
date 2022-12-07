import { Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { useController, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import AdapterScore from "./components/AdapterScore"
import Score from "./components/Score"

const yupRequirementTypes = [
  {
    label: "Have at least [x] Yup score",
    value: "YUP_SCORE",
    YupRequirement: Score,
  },
  {
    label: "Have at least [x] Yup score of an adapter",
    value: "YUP_ADAPTER_SCORE",
    YupRequirement: AdapterScore,
  },
]

const YupForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    field: { name, onBlur, onChange, ref, value },
  } = useController({
    name: `${baseFieldPath}.type`,
    rules: { required: "It's required to select a type" },
  })

  const {
    resetField,
    formState: { errors },
  } = useFormContext()

  const selected = yupRequirementTypes.find((reqType) => reqType.value === value)

  const resetFields = () => {
    resetField(`${baseFieldPath}.data.minAmount`)
    resetField(`${baseFieldPath}.data.adapter`)
  }

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>
        <StyledSelect
          options={yupRequirementTypes}
          name={name}
          onBlur={onBlur}
          onChange={(newValue: { label: string; value: string }) => {
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

      {selected?.YupRequirement && (
        <>
          <Divider />
          <selected.YupRequirement baseFieldPath={baseFieldPath} />
        </>
      )}
    </Stack>
  )
}

export default YupForm
